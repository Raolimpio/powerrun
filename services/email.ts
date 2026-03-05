import nodemailer from 'nodemailer';

// Interface removida - usando objeto direto no nodemailer

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private initializationAttempted = false;

  // Inicialização lazy - só inicializa quando necessário
  private ensureTransporter() {
    if (this.transporter) {
      return;
    }

    if (!this.initializationAttempted) {
      this.initializationAttempted = true;
      this.initializeTransporter();
    }
  }

  private initializeTransporter() {
    const host = process.env.SMTP_HOST || 'smtppro.zoho.com';
    const port = parseInt(process.env.SMTP_PORT || '587');
    const secure = process.env.SMTP_SECURE === 'true';
    const user = process.env.SMTP_USER || 'dev@opendreams.com.br';
    const password = process.env.SMTP_PASSWORD || '';

    console.log('📧 [EMAIL] Inicializando transporter SMTP:', {
      host,
      port,
      secure,
      user: user ? `${user.substring(0, 3)}***` : 'não configurado',
      hasPassword: !!password,
      env: process.env.NODE_ENV,
    });

    // Verificar se as credenciais estão configuradas
    if (!user || !password) {
      const errorMsg = 'Credenciais SMTP não configuradas. Verifique SMTP_USER e SMTP_PASSWORD nas variáveis de ambiente.';
      console.error('❌ [EMAIL]', errorMsg);
      console.error('❌ [EMAIL] Variáveis disponíveis:', {
        SMTP_HOST: !!process.env.SMTP_HOST,
        SMTP_PORT: !!process.env.SMTP_PORT,
        SMTP_SECURE: !!process.env.SMTP_SECURE,
        SMTP_USER: !!process.env.SMTP_USER,
        SMTP_PASSWORD: !!process.env.SMTP_PASSWORD,
        SMTP_FROM: !!process.env.SMTP_FROM,
      });
      throw new Error(errorMsg);
    }

    const config: any = {
      host,
      port,
      secure, // true para 465, false para outras portas
      auth: {
        user,
        pass: password, // nodemailer usa 'pass' ao invés de 'password'
      },
      tls: {
        // Não rejeitar certificados não autorizados
        rejectUnauthorized: false,
      },
    };

    this.transporter = nodemailer.createTransport(config);
    console.log('✅ [EMAIL] Transporter SMTP inicializado com sucesso');
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    // Garantir que o transporter está inicializado
    try {
      this.ensureTransporter();
    } catch (error: any) {
      console.error('❌ [EMAIL] Erro ao inicializar transporter:', error.message);
      throw error;
    }

    if (!this.transporter) {
      const errorMsg = 'Email transporter não inicializado após tentativa de inicialização';
      console.error('❌ [EMAIL]', errorMsg);
      throw new Error(errorMsg);
    }

    const recipients = Array.isArray(options.to) ? options.to : [options.to];

    console.log('📧 [EMAIL] Tentando enviar email:', {
      to: recipients,
      subject: options.subject,
      from: options.from || process.env.SMTP_FROM || 'Open Dreams <dev@opendreams.com.br>',
    });

    try {
      const info = await this.transporter.sendMail({
        from: options.from || process.env.SMTP_FROM || 'Open Dreams <dev@opendreams.com.br>',
        to: recipients.join(', '),
        subject: options.subject,
        html: options.html,
      });

      console.log('✅ [EMAIL] Email enviado com sucesso:', {
        messageId: info.messageId,
        to: recipients,
        subject: options.subject,
      });
    } catch (error: any) {
      console.error('❌ [EMAIL] Erro ao enviar e-mail:', {
        error: error.message,
        code: error.code,
        to: recipients,
        subject: options.subject,
      });
      if (error.code === 'EAUTH') {
        throw new Error('Erro de autenticação SMTP. Verifique as credenciais no .env.local');
      }
      if (error.code === 'ECONNECTION') {
        throw new Error('Erro de conexão SMTP. Verifique SMTP_HOST e SMTP_PORT');
      }
      throw error;
    }
  }

  async sendBulkEmail(options: SendEmailOptions): Promise<void> {
    const recipients = Array.isArray(options.to) ? options.to : [options.to];
    
    // Filtrar e limpar emails
    const cleanRecipients = recipients
      .map(email => (typeof email === 'string' ? email.trim() : email))
      .filter(email => email && email.length > 0);
    
    console.log('📧 [EMAIL] Enviando email em lote para', cleanRecipients.length, 'destinatários:', cleanRecipients);
    
    if (cleanRecipients.length === 0) {
      console.warn('⚠️ [EMAIL] Nenhum destinatário válido encontrado');
      return;
    }
    
    // Enviar para cada destinatário individualmente para melhor controle
    let successCount = 0;
    let errorCount = 0;
    
    for (const recipient of cleanRecipients) {
      try {
        console.log(`📧 [EMAIL] Enviando para destinatário ${successCount + errorCount + 1}/${cleanRecipients.length}:`, recipient);
        await this.sendEmail({
          ...options,
          to: recipient,
        });
        successCount++;
        console.log(`✅ [EMAIL] Email enviado com sucesso para: ${recipient}`);
      } catch (error: any) {
        errorCount++;
        console.error(`❌ [EMAIL] Erro ao enviar para ${recipient}:`, error.message);
        // Continua enviando para os outros destinatários mesmo se um falhar
      }
    }
    
    console.log(`✅ [EMAIL] Processo de envio concluído: ${successCount} sucesso, ${errorCount} erros de ${cleanRecipients.length} destinatários`);
  }

  async verifyConnection(): Promise<boolean> {
    try {
      this.ensureTransporter();
    } catch (error: any) {
      console.error('❌ [EMAIL] Erro ao inicializar transporter para verificação:', error.message);
      return false;
    }

    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('✅ [EMAIL] Conexão SMTP verificada com sucesso');
      return true;
    } catch (error: any) {
      console.error('❌ [EMAIL] Erro ao verificar conexão SMTP:', {
        message: error.message,
        code: error.code,
      });
      return false;
    }
  }
}

// Exportar instância - inicialização será lazy quando necessário
export const emailService = new EmailService();

