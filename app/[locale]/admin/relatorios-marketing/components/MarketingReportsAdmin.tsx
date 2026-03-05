'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { Mail, Calendar, Eye, Send, Clock, CheckCircle2, AlertCircle, History, TrendingUp, XCircle, Bell } from 'lucide-react';
import { format, isMonday, getDate, startOfWeek, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ScheduleInfo {
  type: 'weekly' | 'biweekly' | 'monthly';
  label: string;
  nextDate: Date;
  description: string;
}

export function MarketingReportsAdmin() {
  const [previewPeriod, setPreviewPeriod] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [sendingReport, setSendingReport] = useState<'weekly' | 'biweekly' | 'monthly' | null>(null);
  const [sendSuccess, setSendSuccess] = useState<'weekly' | 'biweekly' | 'monthly' | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [history, setHistory] = useState<any>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [notificationPreviewType, setNotificationPreviewType] = useState<'whatsapp' | 'quote'>('whatsapp');
  const [notificationPreviewHtml, setNotificationPreviewHtml] = useState<string>('');
  const [loadingNotificationPreview, setLoadingNotificationPreview] = useState(false);

  const locale = 'pt-BR';

  // Calcular próximos envios
  const getNextSchedules = (): ScheduleInfo[] => {
    const now = new Date();
    const schedules: ScheduleInfo[] = [];

    // Próxima segunda-feira (semanal)
    let nextMondayDate: Date;
    if (isMonday(now)) {
      nextMondayDate = now;
    } else {
      const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 }); // Segunda-feira como início da semana
      nextMondayDate = addDays(startOfCurrentWeek, 7);
    }
    schedules.push({
      type: 'weekly',
      label: 'Relatório Semanal',
      nextDate: nextMondayDate,
      description: 'Enviado toda segunda-feira às 9h UTC (6h horário de Brasília)',
    });

    // Próximos dias 1 e 16 (quinzenal)
    const dayOfMonth = getDate(now);
    let nextBiweekly: Date;
    if (dayOfMonth < 1) {
      nextBiweekly = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (dayOfMonth < 16) {
      nextBiweekly = new Date(now.getFullYear(), now.getMonth(), 16);
    } else {
      nextBiweekly = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }
    schedules.push({
      type: 'biweekly',
      label: 'Relatório Quinzenal',
      nextDate: nextBiweekly,
      description: 'Enviado nos dias 1 e 16 de cada mês às 9h UTC',
    });

    // Próximo dia 1 (mensal)
    let nextMonthly: Date;
    if (dayOfMonth === 1) {
      nextMonthly = now;
    } else {
      nextMonthly = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }
    schedules.push({
      type: 'monthly',
      label: 'Relatório Mensal',
      nextDate: nextMonthly,
      description: 'Enviado no dia 1 de cada mês às 9h UTC',
    });

    return schedules.sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime());
  };

  const schedules = getNextSchedules();

  // Carregar preview do template
  const loadPreview = async (period: 'weekly' | 'biweekly' | 'monthly') => {
    setLoadingPreview(true);
    setPreviewHtml('');
    try {
      const response = await fetch(`/api/marketing-report?period=${period}&preview=true`);
      if (response.ok) {
        const html = await response.text();
        setPreviewHtml(html);
      } else {
        setPreviewHtml('<p class="text-red-600 p-4">Erro ao carregar preview do relatório.</p>');
      }
    } catch (error) {
      setPreviewHtml('<p class="text-red-600 p-4">Erro ao carregar preview do relatório.</p>');
    } finally {
      setLoadingPreview(false);
    }
  };

  // Enviar relatório manualmente
  const sendReport = async (period: 'weekly' | 'biweekly' | 'monthly') => {
    setSendingReport(period);
    setSendSuccess(null);
    setSendError(null);

    try {
      const response = await fetch('/api/marketing-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ period, forceSend: true }),
      });

      const data = await response.json();

      if (response.ok) {
        setSendSuccess(period);
        setTimeout(() => setSendSuccess(null), 5000);
      } else {
        setSendError(data.message || 'Erro ao enviar relatório');
        setTimeout(() => setSendError(null), 5000);
      }
    } catch (error: any) {
      setSendError(error.message || 'Erro ao enviar relatório');
      setTimeout(() => setSendError(null), 5000);
    } finally {
      setSendingReport(null);
    }
  };

  // Carregar histórico de envios
  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch('/api/marketing-report/history');
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Carregar preview do template de notificação
  const loadNotificationPreview = async (type: 'whatsapp' | 'quote') => {
    setLoadingNotificationPreview(true);
    setNotificationPreviewHtml('');
    try {
      const response = await fetch(`/api/notifications/preview?type=${type}`);
      if (response.ok) {
        const html = await response.text();
        setNotificationPreviewHtml(html);
      } else {
        setNotificationPreviewHtml('<p class="text-red-600 p-4">Erro ao carregar preview da notificação.</p>');
      }
    } catch (error) {
      setNotificationPreviewHtml('<p class="text-red-600 p-4">Erro ao carregar preview da notificação.</p>');
    } finally {
      setLoadingNotificationPreview(false);
    }
  };

  useEffect(() => {
    loadPreview(previewPeriod);
    loadHistory();
    loadNotificationPreview(notificationPreviewType);
  }, [previewPeriod, notificationPreviewType]);

  // Recarregar histórico após envio bem-sucedido
  useEffect(() => {
    if (sendSuccess) {
      setTimeout(() => {
        loadHistory();
      }, 1000);
    }
  }, [sendSuccess]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar locale={locale} />
      
      <div className="flex-1 lg:ml-64">
        <DashboardHeader
          title="Relatórios de Marketing"
          onRefresh={() => loadPreview(previewPeriod)}
          onLogout={async () => {
            await fetch('/api/admin/auth', { method: 'DELETE' });
            window.location.reload();
          }}
        />

        <main className="p-6 space-y-6">
          {/* Alertas de sucesso/erro */}
          {sendSuccess && (
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-green-900 font-semibold">
                  Relatório {sendSuccess === 'weekly' ? 'Semanal' : sendSuccess === 'biweekly' ? 'Quinzenal' : 'Mensal'} enviado com sucesso!
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Os destinatários receberão o e-mail em instantes.
                </p>
              </div>
            </div>
          )}

          {sendError && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-900 font-semibold">Erro ao enviar relatório</p>
                <p className="text-sm text-red-700 mt-1">{sendError}</p>
              </div>
            </div>
          )}

          {/* Agendamento */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-[#9c1006]" />
                <h2 className="text-xl font-semibold text-[#374151]">Agendamento de Envios</h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Os relatórios são enviados automaticamente via cron job configurado no Vercel
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {schedules.map((schedule) => (
                  <div
                    key={schedule.type}
                    className="border border-gray-200 rounded-lg p-4 hover:border-[#9c1006] transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-[#374151]">{schedule.label}</h3>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                            {schedule.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{schedule.description}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            <strong>Próximo envio:</strong>{' '}
                            {format(schedule.nextDate, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => sendReport(schedule.type)}
                          disabled={sendingReport !== null}
                          className={`px-4 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium ${
                            sendSuccess === schedule.type
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : sendingReport === schedule.type
                              ? 'bg-[#9c1006] text-white'
                              : 'bg-[#9c1006] text-white hover:bg-[#7a0d05]'
                          }`}
                        >
                          {sendingReport === schedule.type ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Enviando...
                            </>
                          ) : sendSuccess === schedule.type ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              Enviado!
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Enviar Agora
                            </>
                          )}
                        </button>
                        {sendSuccess === schedule.type && (
                          <span className="text-xs text-green-600 font-medium animate-pulse">
                            ✓ Relatório enviado com sucesso
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 mb-1">Informações Importantes</p>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                      <li>Os relatórios são enviados automaticamente pelo Vercel Cron Jobs</li>
                      <li>O horário é em UTC (9h UTC = 6h horário de Brasília)</li>
                      <li>Os destinatários são: rogerio@vibromak.com.br, comercial@powerrun.com.br, vendas@powerrun.com.br, export@vibromak.com.br</li>
                      <li>Você pode enviar manualmente usando o botão "Enviar Agora"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview do Template */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-[#9c1006]" />
                  <h2 className="text-xl font-semibold text-[#374151]">Preview do Template de E-mail</h2>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={previewPeriod}
                    onChange={(e) => setPreviewPeriod(e.target.value as 'weekly' | 'biweekly' | 'monthly')}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#9c1006] focus:border-transparent"
                  >
                    <option value="weekly">Semanal</option>
                    <option value="biweekly">Quinzenal</option>
                    <option value="monthly">Mensal</option>
                  </select>
                  <button
                    onClick={() => loadPreview(previewPeriod)}
                    disabled={loadingPreview}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm font-medium flex items-center gap-2"
                  >
                    {loadingPreview ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                        Carregando...
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Atualizar Preview
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Visualize como o e-mail será enviado para os destinatários
              </p>
            </div>

            <div className="p-6">
              {loadingPreview && !previewHtml ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#9c1006] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Carregando preview do relatório...</p>
                  </div>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 border-b border-gray-200 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Preview do E-mail</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {previewPeriod === 'weekly' && 'Relatório Semanal'}
                      {previewPeriod === 'biweekly' && 'Relatório Quinzenal'}
                      {previewPeriod === 'monthly' && 'Relatório Mensal'}
                    </span>
                  </div>
                  <div className="bg-white">
                    <iframe
                      srcDoc={previewHtml}
                      className="w-full h-[800px] border-0"
                      title="Email Preview"
                      sandbox="allow-same-origin"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview do Template de Notificação */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-6 h-6 text-[#9c1006]" />
                  <h2 className="text-xl font-semibold text-[#374151]">Preview do Template de Notificação</h2>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={notificationPreviewType}
                    onChange={(e) => setNotificationPreviewType(e.target.value as 'whatsapp' | 'quote')}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#9c1006] focus:border-transparent"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="quote">Solicitação de Orçamento</option>
                  </select>
                  <button
                    onClick={() => loadNotificationPreview(notificationPreviewType)}
                    disabled={loadingNotificationPreview}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm font-medium flex items-center gap-2"
                  >
                    {loadingNotificationPreview ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                        Carregando...
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Atualizar Preview
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Visualize como o e-mail de notificação será enviado quando um cliente clicar em WhatsApp ou solicitar orçamento
              </p>
            </div>

            <div className="p-6">
              {loadingNotificationPreview && !notificationPreviewHtml ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#9c1006] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Carregando preview da notificação...</p>
                  </div>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 border-b border-gray-200 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Preview do E-mail de Notificação</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {notificationPreviewType === 'whatsapp' ? 'Notificação WhatsApp' : 'Notificação de Orçamento'}
                    </span>
                  </div>
                  <div className="bg-white">
                    <iframe
                      srcDoc={notificationPreviewHtml}
                      className="w-full h-[600px] border-0"
                      title="Notification Email Preview"
                      sandbox="allow-same-origin"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Histórico de Envios */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <History className="w-6 h-6 text-[#9c1006]" />
                  <h2 className="text-xl font-semibold text-[#374151]">Histórico de Envios</h2>
                </div>
                <button
                  onClick={loadHistory}
                  disabled={loadingHistory}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm font-medium flex items-center gap-2"
                >
                  {loadingHistory ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                      Carregando...
                    </>
                  ) : (
                    <>
                      <History className="w-4 h-4" />
                      Atualizar
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Acompanhe o histórico de envios automáticos e manuais
              </p>
            </div>

            <div className="p-6">
              {history && (
                <>
                  {/* Estatísticas */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Total de Envios</div>
                      <div className="text-2xl font-bold text-[#374151]">{history.stats.total}</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-sm text-green-600 mb-1">Sucessos</div>
                      <div className="text-2xl font-bold text-green-700">{history.stats.success}</div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="text-sm text-red-600 mb-1">Falhas</div>
                      <div className="text-2xl font-bold text-red-700">{history.stats.failed}</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-sm text-blue-600 mb-1">Taxa de Sucesso</div>
                      <div className="text-2xl font-bold text-blue-700">{history.stats.successRate}%</div>
                    </div>
                  </div>

                  {/* Últimas Falhas */}
                  {history.recentFailures && history.recentFailures.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <h3 className="font-semibold text-[#374151]">Últimas Falhas</h3>
                      </div>
                      <div className="space-y-2">
                        {history.recentFailures.map((failure: any) => (
                          <div
                            key={failure.id}
                            className="bg-red-50 border border-red-200 rounded-lg p-4"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <XCircle className="w-4 h-4 text-red-600" />
                                  <span className="font-semibold text-red-900">
                                    {failure.periodLabel} - {format(new Date(failure.sentAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                  </span>
                                </div>
                                <p className="text-sm text-red-700">{failure.errorMessage}</p>
                                <p className="text-xs text-red-600 mt-1">
                                  Disparado por: {failure.triggeredBy === 'cron' ? 'Agendamento Automático' : 'Envio Manual'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Histórico Completo */}
                  <div>
                    <h3 className="font-semibold text-[#374151] mb-3">Últimos Envios</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left p-3 text-sm font-semibold text-gray-700">Data/Hora</th>
                            <th className="text-left p-3 text-sm font-semibold text-gray-700">Período</th>
                            <th className="text-left p-3 text-sm font-semibold text-gray-700">Status</th>
                            <th className="text-left p-3 text-sm font-semibold text-gray-700">Tipo</th>
                            <th className="text-left p-3 text-sm font-semibold text-gray-700">Erro</th>
                          </tr>
                        </thead>
                        <tbody>
                          {history.logs.map((log: any) => (
                            <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="p-3 text-sm text-gray-700">
                                {format(new Date(log.sentAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                              </td>
                              <td className="p-3 text-sm font-medium text-[#374151]">{log.periodLabel}</td>
                              <td className="p-3">
                                {log.status === 'success' ? (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium flex items-center gap-1 w-fit">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Sucesso
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium flex items-center gap-1 w-fit">
                                    <XCircle className="w-3 h-3" />
                                    Falha
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-sm text-gray-600">
                                {log.triggeredBy === 'cron' ? 'Automático' : 'Manual'}
                              </td>
                              <td className="p-3 text-sm text-red-600 max-w-xs truncate">
                                {log.errorMessage || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {!history && !loadingHistory && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum histórico disponível ainda.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

