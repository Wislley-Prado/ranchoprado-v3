
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Droplets, TrendingUp, Activity, RefreshCw } from 'lucide-react';
import { useDamData } from '@/hooks/useDamData';
import { getStatusFromLevel } from '@/utils/damStatus';
import { Condition } from '@/types/damData';
import DamHeader from './dam/DamHeader';
import ConditionsGrid from './dam/ConditionsGrid';
import HistoryTable from './dam/HistoryTable';
import DamDashboard from './dam/DamDashboard';
import DamHistoryChart from './dam/DamHistoryChart';
import CemigDamCard from './dam/CemigDamCard';

const DamInfo = () => {
  const { data: damData, isLoading, error, refetch, dataUpdatedAt } = useDamData();
  const renderCount = useRef(0);
  renderCount.current += 1;

  const nivelAtualMetros = damData?.nivel_atual ? parseFloat(damData.nivel_atual) : 569.8;
  const volumePercentual = damData?.volume_util_percentual ? parseFloat(damData.volume_util_percentual) : 82;
  const afluencia = damData?.afluencia || '--';
  const defluencia = damData?.defluencia || '--';

  const levelStatus = getStatusFromLevel(volumePercentual);

  const conditions: Condition[] = [
    {
      label: "Nível da Represa",
      value: `${nivelAtualMetros.toFixed(1)}m`,
      status: levelStatus.status,
      icon: <Droplets className="h-5 w-5" />,
      trend: "stable"
    },
    {
      label: "Volume Útil",
      value: `${volumePercentual.toFixed(1)}%`,
      status: levelStatus.status,
      icon: <TrendingUp className="h-5 w-5" />,
      trend: "stable"
    },
    {
      label: "Afluência",
      value: `${afluencia} m³/s`,
      status: "good",
      icon: <Activity className="h-5 w-5" />,
      trend: "stable"
    },
    {
      label: "Defluência",
      value: `${defluencia} m³/s`,
      status: "good",
      icon: <Activity className="h-5 w-5" />,
      trend: "stable"
    }
  ];

  const handleRefetch = () => {
    refetch();
  };

  const errorForComponents = error instanceof Error ? error : new Error('Unknown error occurred');

  return (
    <section id="represa" className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DamHeader 
          damData={damData}
          isLoading={isLoading}
          error={error ? errorForComponents : undefined}
          refetch={handleRefetch}
        />

        <div className="mb-10">
          <CemigDamCard
            damData={damData}
            isLoading={isLoading}
            onRefresh={handleRefetch}
          />
        </div>

        <DamDashboard
          damData={damData}
          isLoading={isLoading}
          error={error ? errorForComponents : undefined}
          dataUpdatedAt={dataUpdatedAt}
          renderCount={renderCount.current}
          onRefresh={handleRefetch}
        />

        <div className="mb-8">
          <DamHistoryChart damData={damData} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader className="bg-rio-blue text-white">
                <CardTitle className="text-2xl flex items-center justify-between">
                  <div className="flex items-center">
                    <Droplets className="mr-3 h-6 w-6" />
                    Status Atual da Represa
                  </div>
                  <button 
                    onClick={handleRefetch} 
                    className="p-2 hover:bg-blue-600 rounded-full transition-colors"
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </CardTitle>
                <p className="text-blue-100">
                  {damData ? 'Dados em tempo real' : 'Últimos dados disponíveis'}
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Nível: {nivelAtualMetros.toFixed(1)}m
                    </h3>
                    <Badge className={`${levelStatus.color} text-white`}>
                      {levelStatus.text}
                    </Badge>
                  </div>
                  <Progress value={volumePercentual} className="h-4 mb-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Mínimo (40%)</span>
                    <span>Atual: {volumePercentual.toFixed(1)}%</span>
                    <span>Máximo (100%)</span>
                  </div>
                </div>

                <ConditionsGrid conditions={conditions} defluencia={defluencia} />

                <HistoryTable historicoDias={damData?.historico_dias || []} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
          </div>
        </div>
      </div>
    </section>
  );
};

export default DamInfo;