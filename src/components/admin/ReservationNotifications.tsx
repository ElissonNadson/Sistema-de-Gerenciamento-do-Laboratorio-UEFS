import React from 'react';
import { Bell, CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useReservations } from '../../hooks/useReservations';
import type { Reservation } from '../../types/reservations';

interface ReservationNotificationsProps {
  onReservationAction?: (reservation: Reservation, action: 'approve' | 'reject') => void;
  maxNotifications?: number;
}

export const ReservationNotifications: React.FC<ReservationNotificationsProps> = ({
  onReservationAction,
  maxNotifications = 5
}) => {
  const { reservations, loading } = useReservations();

  const pendingReservations = reservations
    .filter(r => r.status === 'pending')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, maxNotifications);

  const recentActions = reservations
    .filter(r => r.status !== 'pending')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">Carregando notificações...</span>
        </div>
      </Card>
    );
  }

  if (pendingReservations.length === 0 && recentActions.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">Nenhuma notificação</span>
        </div>
        <p className="text-xs text-gray-500">
          Você será notificado quando houver novas reservas para aprovar
        </p>
      </Card>
    );
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getActionIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getActionText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovada';
      case 'rejected':
        return 'Rejeitada';
      default:
        return 'Pendente';
    }
  };

  return (
    <Card className="p-4 max-w-md">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          <Bell className="h-5 w-5 text-blue-600" />
          {pendingReservations.length > 0 && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {pendingReservations.length}
            </div>
          )}
        </div>
        <h3 className="font-semibold text-gray-800">Notificações</h3>
      </div>

      <div className="space-y-3">
        {/* Reservas Pendentes */}
        {pendingReservations.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Clock className="h-4 w-4 text-yellow-600" />
              Aguardando Aprovação ({pendingReservations.length})
            </h4>
            <div className="space-y-2">
              {pendingReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-3 w-3 text-gray-600" />
                        <span className="text-sm font-medium">{reservation.userName}</span>
                        <span className="text-xs text-gray-500">
                          ({reservation.userType === 'professor' ? 'Professor' : 'Estudante'})
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>📅 {reservation.dates && reservation.dates.length > 0 
                          ? `${new Date(reservation.dates[0]).toLocaleDateString('pt-BR')} ${reservation.dates.length > 1 ? `(+${reservation.dates.length - 1} datas)` : ''}`
                          : 'Data não definida'
                        }</div>
                        <div>🕐 {reservation.startTime} - {reservation.endTime}</div>
                        {reservation.subject && (
                          <div>📚 {reservation.subject} - {reservation.course}</div>
                        )}
                        <div className="text-gray-500">
                          Solicitado em {formatDateTime(reservation.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    {onReservationAction && (
                      <div className="flex flex-col gap-1 ml-2">
                        <Button
                          size="sm"
                          onClick={() => onReservationAction(reservation, 'approve')}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"
                        >
                          ✓ Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onReservationAction(reservation, 'reject')}
                          className="border-red-300 text-red-600 hover:bg-red-50 text-xs px-2 py-1"
                        >
                          ✗ Rejeitar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ações Recentes */}
        {recentActions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Ações Recentes
            </h4>
            <div className="space-y-2">
              {recentActions.map((reservation) => (
                <div
                  key={reservation.id}
                  className="p-2 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {getActionIcon(reservation.status)}
                    <div className="flex-1">
                      <div className="text-sm">
                        <span className="font-medium">{reservation.userName}</span>
                        <span className="text-gray-600 ml-1">
                          - {getActionText(reservation.status)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {reservation.dates && reservation.dates.length > 0 
                          ? `${new Date(reservation.dates[0]).toLocaleDateString('pt-BR')} ${reservation.dates.length > 1 ? `(+${reservation.dates.length - 1})` : ''}`
                          : 'Data não definida'
                        } às {reservation.startTime}
                      </div>
                      {reservation.updatedAt && (
                        <div className="text-xs text-gray-400">
                          {formatDateTime(reservation.updatedAt)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {pendingReservations.length > maxNotifications && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            +{pendingReservations.length - maxNotifications} reservas pendentes...
          </p>
        </div>
      )}
    </Card>
  );
};
