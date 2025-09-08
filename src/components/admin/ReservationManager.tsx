import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  Check, 
  X, 
  Clock, 
  User, 
  Mail, 
  BookOpen, 
  GraduationCap,
  AlertCircle,
  Filter,
  Bell,
  Search
} from 'lucide-react';
import { useReservations } from '../../hooks/useReservations';
import { useAuth } from '../../hooks/useAuth';
import type { ScheduleFilters } from '../../types/reservations';

interface AdminReservationManagerProps {
  showNotifications?: boolean;
}

export const AdminReservationManager: React.FC<AdminReservationManagerProps> = ({
  showNotifications = true
}) => {
  const { user } = useAuth();
  const {
    reservations,
    loading,
    error,
    updateReservationStatus,
    filterReservations
  } = useReservations();

  const [filters, setFilters] = useState<ScheduleFilters>({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  // Filtrar reservas com base nos critérios
  const filteredReservations = filterReservations(filters).filter(reservation => {
    if (selectedStatus !== 'all' && reservation.status !== selectedStatus) {
      return false;
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        reservation.userName.toLowerCase().includes(searchLower) ||
        reservation.userEmail.toLowerCase().includes(searchLower) ||
        reservation.subject?.toLowerCase().includes(searchLower) ||
        reservation.course?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const pendingCount = reservations.filter(r => r.status === 'pending').length;

  const handleApprove = async (reservationId: string) => {
    if (!user) return;
    
    try {
      await updateReservationStatus(reservationId, 'approved', user.uid);
    } catch (err) {
      console.error('Erro ao aprovar reserva:', err);
    }
  };

  const handleReject = async (reservationId: string) => {
    if (!user) return;
    
    try {
      await updateReservationStatus(reservationId, 'rejected', user.uid, rejectionReason);
      setRejectingId(null);
      setRejectionReason('');
    } catch (err) {
      console.error('Erro ao rejeitar reserva:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
            <AlertCircle className="h-3 w-3" />
            Pendente
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
            <Check className="h-3 w-3" />
            Aprovada
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
            <X className="h-3 w-3" />
            Rejeitada
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com notificações */}
      {showNotifications && pendingCount > 0 && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">
                {pendingCount} reserva{pendingCount > 1 ? 's' : ''} aguardando aprovação
              </p>
              <p className="text-sm text-yellow-700">
                Verifique as solicitações pendentes abaixo
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Filtros */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="startDate">Data Inicial</Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="endDate">Data Final</Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendente</option>
              <option value="approved">Aprovada</option>
              <option value="rejected">Rejeitada</option>
            </select>
          </div>

          <div>
            <Label htmlFor="search">Buscar</Label>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="search"
                type="text"
                placeholder="Nome, email, matéria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Lista de Reservas */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">
          Reservas ({filteredReservations.length})
        </h2>

        {filteredReservations.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma reserva encontrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReservations.map((reservation) => (
              <Card key={reservation.id} className="p-4 border-l-4 border-l-blue-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">{reservation.userName}</span>
                      <span className="text-sm text-gray-600">
                        ({reservation.userType === 'professor' ? 'Professor' : 'Estudante'})
                      </span>
                      {getStatusBadge(reservation.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{reservation.userEmail}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {reservation.dates && reservation.dates.length > 0 
                              ? `${formatDate(reservation.dates[0])} ${reservation.dates.length > 1 ? `(+${reservation.dates.length - 1} datas)` : ''}`
                              : 'Data não definida'
                            } - {reservation.startTime} às {reservation.endTime}
                          </span>
                        </div>
                      </div>

                      {reservation.userType === 'professor' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span>{reservation.subject}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            <span>{reservation.course}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {reservation.observations && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                        <span className="font-medium">Observações:</span> {reservation.observations}
                      </div>
                    )}

                    {reservation.status === 'rejected' && reservation.rejectionReason && (
                      <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm">
                        <span className="font-medium text-red-800">Motivo da rejeição:</span>
                        <p className="text-red-700">{reservation.rejectionReason}</p>
                      </div>
                    )}

                    <div className="mt-2 text-xs text-gray-500">
                      Solicitado em: {reservation.createdAt.toLocaleString('pt-BR')}
                    </div>
                  </div>

                  {/* Ações */}
                  {reservation.status === 'pending' && (
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(reservation.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Aprovar
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRejectingId(reservation.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </div>

                {/* Modal de rejeição */}
                {rejectingId === reservation.id && (
                  <div className="mt-4 p-4 border-t bg-red-50">
                    <Label htmlFor="rejectionReason">Motivo da rejeição:</Label>
                    <textarea
                      id="rejectionReason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Descreva o motivo da rejeição..."
                      className="w-full mt-2 p-2 border rounded-md resize-none"
                      rows={3}
                    />
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => handleReject(reservation.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Confirmar Rejeição
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setRejectingId(null);
                          setRejectionReason('');
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
