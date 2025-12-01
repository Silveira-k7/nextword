import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { negocioService, consultoriaService } from '../services/database';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Building2, BarChart3, Map, Users, Plus, MessageCircle } from 'lucide-react';
import { Negocio } from '../lib/supabase';

export function DashboardEmpresa() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [consultorias, setConsultorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultoria, setSelectedConsultoria] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [negociosData, consultoriasData] = await Promise.all([
        negocioService.getAll(),
        consultoriaService.getAll()
      ]);
      setNegocios(negociosData);
      setConsultorias(consultoriasData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const consultoriasEmAndamento = consultorias.filter(c => c.status === 'Em Andamento');

  const handleOpenChat = (consultoriaId: string) => {
    navigate(`/chat?consultoria=${consultoriaId}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo, {usuario?.nome}!
          </h1>
          <p className="text-gray-600 mt-2">Gerencie seus negócios e busque ajuda especializada</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Minhas Ajudas</p>
                  <p className="text-2xl font-bold">{negocios.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Diagnósticos</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Roadmaps</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Map className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Consultorias</p>
                  <p className="text-2xl font-bold">{consultorias.length}</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Minhas Ajudas</h2>
              <Link to="/criar-negocio">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Solicitar Ajuda
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {negocios.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Você ainda não solicitou ajuda para seu negócio</p>
                <Link to="/criar-negocio">
                  <Button>Solicitar Primeira Ajuda</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {negocios.map((negocio) => (
                  <div
                    key={negocio.id_negocio}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">{negocio.nome_negocio}</h3>
                      <p className="text-sm text-gray-600">{negocio.tipo_negocio}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/negocio/${negocio.id_negocio}/diagnostico`}>
                        <Button variant="outline" size="sm">Diagnóstico</Button>
                      </Link>
                      <Link to={`/negocio/${negocio.id_negocio}`}>
                        <Button variant="ghost" size="sm">Ver Detalhes</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {consultoriasEmAndamento.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <h2 className="text-xl font-semibold">Minhas Consultorias Ativas</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {consultoriasEmAndamento.map((consultoria) => (
                  <div
                    key={consultoria.id_consultoria}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{consultoria.consultor?.nome || 'Consultor'}</h3>
                      <p className="text-sm text-gray-600">{consultoria.consultor?.email || 'Email não disponível'}</p>
                      {consultoria.descricao && (
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="font-medium">Solicitação:</span> {consultoria.descricao}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Status: {consultoria.status}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedConsultoria(consultoria)}
                      >
                        Ver Detalhes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenChat(consultoria.id_consultoria)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Abrir Chat
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">Ações Rápidas</h2>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-3">
              <Link to="/buscar-consultoria" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Buscar Consultoria
                </Button>
              </Link>
              <Link to="/conteudo-educativo" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Conteúdo Educativo
                </Button>
              </Link>
              {negocios.length > 0 && (
                <Link to={`/negocio/${negocios[0].id_negocio}/roadmap`} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Map className="h-4 w-4 mr-2" />
                    Ver Roadmap
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedConsultoria && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedConsultoria(null)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">Detalhes da Consultoria</h2>
              <button onClick={() => setSelectedConsultoria(null)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Consultor</h3>
                <p className="text-gray-900">{selectedConsultoria.consultor?.nome || 'Não definido'}</p>
                <p className="text-sm text-gray-600">{selectedConsultoria.consultor?.email}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Status</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                  selectedConsultoria.status === 'Em Andamento' ? 'bg-green-100 text-green-800' :
                  selectedConsultoria.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedConsultoria.status}
                </span>
              </div>

              {selectedConsultoria.descricao && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Descrição da Solicitação</h3>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedConsultoria.descricao}</p>
                </div>
              )}

              {selectedConsultoria.link_reuniao && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Link da Reunião</h3>
                  <a href={selectedConsultoria.link_reuniao} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                    {selectedConsultoria.link_reuniao}
                  </a>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Data de Criação</h3>
                <p className="text-gray-900">{new Date(selectedConsultoria.created_at).toLocaleString('pt-BR')}</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => {
                  setSelectedConsultoria(null);
                  handleOpenChat(selectedConsultoria.id_consultoria);
                }} className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Abrir Chat
                </Button>
                <Button variant="outline" onClick={() => setSelectedConsultoria(null)} className="flex-1">
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
