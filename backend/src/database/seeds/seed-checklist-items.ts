import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ChecklistCategory } from '../../modules/checklist/domain/entities/checklist-item-definition.entity.js';
import { ChecklistItemDefinitionOrmEntity } from '../../modules/checklist/infrastructure/persistence/checklist-item-definition.orm-entity.js';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'hazmat',
  password: process.env.DB_PASSWORD ?? 'hazmat',
  database: process.env.DB_NAME ?? 'hazmat_track',
  entities: [ChecklistItemDefinitionOrmEntity],
  synchronize: true,
});

// Transcribed verbatim from the legal reference checklist:
// spec/forms/Lista de Verificação - Transporte de Carga Perigosa.xls
const items: Array<{ category: ChecklistCategory; code: string; description: string }> = [
  {
    category: ChecklistCategory.DOCUMENTATION,
    code: '1.1',
    description: 'Certificado de Registro e Licenciamento do Veículo.',
  },
  {
    category: ChecklistCategory.DOCUMENTATION,
    code: '1.2',
    description:
      'Documento Fiscal contendo as informações relativas à cada substância, produto ou artigo a ser transportado.',
  },
  {
    category: ChecklistCategory.DOCUMENTATION,
    code: '1.3',
    description:
      'Ficha de Emergência da carga transportada adequada às disposições da NBR 7.503/2020.\n\nA Ficha de Emergência deve atender aos requisitos da NBR 7.503/2020.',
  },
  {
    category: ChecklistCategory.DOCUMENTATION,
    code: '1.4',
    description:
      'No caso de transporte de produtos perigosos a granel: \n\nOriginais do Certificado de Inspeção para o Transporte de Produtos Perigosos - CIPP e do Certificado de Inspeção Veicular - CIV, emitidos pelo INMETRO ou entidade por este acreditada.',
  },
  {
    category: ChecklistCategory.DOCUMENTATION,
    code: '1.5',
    description:
      'Autorização ou licença da autoridade competente para expedições de produtos perigosos que, nos termos da legislação estadual ou municipal, necessitem dos referidos documentos (ex.: Licença Ambiental).\n\nÉ recomendável que a empresa possua um documento formal de dispensa do licenciamento ambiental, caso aplicável.',
  },
  {
    category: ChecklistCategory.DOCUMENTATION,
    code: '1.6',
    description:
      'Declaração do Expedidor de que os produtos estão adequadamente acondicionados e estivados para suportar os riscos normais das etapas necessárias à operação de transporte e que atendem à regulamentação em vigor.',
  },
  {
    category: ChecklistCategory.DOCUMENTATION,
    code: '1.7',
    description:
      'Autorização Ambiental de Transporte Interestadual de Produtos Perigosos do IBAMA (aplicável somente para o transporte interestadual).\n\nEstão sujeitos à autorização ambiental as pessoas jurídicas e físicas que estejam regularizadas no Cadastro Técnico Federal de Atividades Potencialmente Poluidoras ou Utilizadoras de Recursos Ambientais – CTF do Ibama.',
  },
  {
    category: ChecklistCategory.DOCUMENTATION,
    code: '1.8',
    description:
      'Autorização Ambiental para o Transporte de Produtos Perigosos do IBAMA, para o transporte interestadual de rejeitos eletroeletrônicos perigosos.',
  },
  {
    category: ChecklistCategory.DOCUMENTATION,
    code: '1.9',
    description:
      'Registro Nacional de Transportadores Rodoviários de Cargas - RNTRC na categoria transportador de transporte rodoviário remunerado de produtos perigosos',
  },
  {
    category: ChecklistCategory.PERSONNEL,
    code: '2.1',
    description:
      'Certificado de Aprovação em curso específico para condutores de veículos utilizados no transporte rodoviário de produtos perigosos e em suas atualizações periódicas.',
  },
  {
    category: ChecklistCategory.PERSONNEL,
    code: '2.2',
    description:
      'Registros de treinamento do pessoal empregado nas atividades de carga, descarga e transbordo de produtos perigosos.',
  },
  {
    category: ChecklistCategory.PERSONNEL,
    code: '2.3',
    description: 'Condições físicas do condutor: embriaguez/sonolência/problema físico',
  },
  {
    category: ChecklistCategory.VEHICLE,
    code: '3.1',
    description: 'Ausência de contaminação no exterior do veículo.',
  },
  {
    category: ChecklistCategory.VEHICLE,
    code: '3.2',
    description:
      'Sinalização de riscos para transporte de produtos perigosos, constituída por:\n\nSinalização da unidade de transporte, por meio de rótulos de risco e painéis de segurança (Capítulo 5.3 da Resolução ANTT 5.998/22) e da rotulagem dos volumes;\n\nRótulos de risco, de segurança, especiais e de símbolos de manuseio (Capítulo 5.2 da Resolução ANTT 5.998/22), quando aplicáveis.',
  },
  {
    category: ChecklistCategory.VEHICLE,
    code: '3.3',
    description:
      'Utilizar no transporte de cargas perigosas veículos certificados pelo Inmetro (ou por entidade por ele credenciada) quanto à sua adequação para esta atividade.\n\nObs.: Na eventualidade de os veículos usados no transporte de cargas perigosas sofrerem acidente ou avaria, a empresa deve submetê-los a nova vistoria e teste pelo INMETRO ou entidade pelo mesmo credenciada.',
  },
  {
    category: ChecklistCategory.VEHICLE,
    code: '3.4',
    description: 'Adequado estado de conservação e a segurança do veículo.',
  },
  {
    category: ChecklistCategory.VEHICLE,
    code: '3.5',
    description:
      'Farol alto e baixo, buzina, velocímetro, lanternas de posição, indicador de mudança de direção (seta/pisca), luzes de freio, luz de placa traseira, alarme e luz de ré.',
  },
  {
    category: ChecklistCategory.VEHICLE,
    code: '3.6',
    description: 'Adequado estado geral dos pneus e rodas.',
  },
  {
    category: ChecklistCategory.VEHICLE,
    code: '3.7',
    description: 'Adequadas condições da carroceria.',
  },
  {
    category: ChecklistCategory.EQUIPMENT,
    code: '4.1',
    description:
      'Extintores de incêndio bem afixados, dentro do prazo de validade, adequados e com capacidade suficiente para combater princípio de incêndio.',
  },
  {
    category: ChecklistCategory.EQUIPMENT,
    code: '4.2',
    description: 'Estojo de ferramentas adequado para reparos em situações de emergência durante a viagem.',
  },
  {
    category: ChecklistCategory.EQUIPMENT,
    code: '4.3',
    description:
      'Equipamentos de Proteção Individual - EPIs adequados aos tipos de produtos transportados, para uso do pessoal envolvido no transporte.',
  },
  {
    category: ChecklistCategory.EQUIPMENT,
    code: '4.4',
    description:
      'Conjunto de equipamentos para situações de emergência, adequado ao tipo de produto transportado (como previsto na NBR 9.735) e, nos casos específicos de transporte de ácido fluorídrico (ONU 1786 e ONU 1790), também o exigido pela NBR 10.271).',
  },
  {
    category: ChecklistCategory.EQUIPMENT,
    code: '4.5',
    description:
      'Existência de no mínimo dois calços de dimensões apropriadas ao peso do veículo e ao diâmetro das rodas e compatível com o material transportado, os quais devem ser colocados de forma a evitar deslocamento do veículo em qualquer dos sentidos possíveis.',
  },
  {
    category: ChecklistCategory.EQUIPMENT,
    code: '4.6',
    description: 'Quatro cones para sinalização da via para uso nas situações de emergências ou avarias.',
  },
  {
    category: ChecklistCategory.EQUIPMENT,
    code: '4.7',
    description: 'Tacógrafo do veículo, nos casos de transporte de produto perigoso a granel.',
  },
  {
    category: ChecklistCategory.CARGO,
    code: '5.1',
    description:
      'Produtos perigosos não transportados sobre embalagem frágil e/ou de materiais facilmente inflamáveis na estiva das embalagens.',
  },
  {
    category: ChecklistCategory.CARGO,
    code: '5.2',
    description:
      'Proibição do transporte produtos perigosos com outro tipo de mercadoria, ou com outro produto perigoso incompatível (ou seja, que, postos em contato entre si, apresentem alterações das características físicas ou químicas originais de qualquer deles, gerando risco de provocar explosão, desprendimento de chama ou calor, formação de compostos, misturas, vapores ou gases perigosos), bem como produtos com risco de contaminação juntamente com animais, alimentos, medicamentos ou objetos destinados a uso humano ou animal ou, ainda, com embalagens de mercadorias destinadas ao mesmo fim, ou ainda, de quaisquer produtos para uso humano ou animal em tanques de carga destinados ao transporte de produtos perigosos a granel.',
  },
  {
    category: ChecklistCategory.CARGO,
    code: '5.3',
    description: 'Probição da condução de pessoas em veículos transportando produtos perigosos (além dos auxiliares).',
  },
  {
    category: ChecklistCategory.CARGO,
    code: '5.4',
    description:
      'Proibição da abertura de volumes contendo produtos perigosos, a prática do fumo ou a entrada em áreas de carga do veículo de transporte de cargas perigosas com dispositivos capazes de produzir ignição dos produtos, seus gases ou vapores, durante as etapas da operação de transporte.',
  },
  {
    category: ChecklistCategory.CARGO,
    code: '5.5',
    description:
      'Para embalagens externas de produtos perigosos expedidos de forma fracionada:\n\nIdentificação relativa aos produtos e seus riscos, a marcação e a comprovação de sua adequação a programa de avaliação da conformidade da autoridade competente.',
  },
  {
    category: ChecklistCategory.CARGO,
    code: '5.6',
    description:
      'Adequado acondicionado dos produtos para suportar os riscos normais de carregamento, descarregamento, transbordo e transporte.',
  },
  {
    category: ChecklistCategory.CARGO,
    code: '5.7',
    description: 'Marcação dos volumes estão marcados com o nome apropriado para embarque.',
  },
  {
    category: ChecklistCategory.CARGO,
    code: '5.8',
    description: 'Selo de Conformidade do INMETRO (ou outro Organismo Certificador) das embalagens utilizadas no transporte;',
  },
  {
    category: ChecklistCategory.CARGO,
    code: '5.9',
    description:
      'Adequado estado geral de conservação das embalagens (atenção para vazamentos), arrumação na unidade de transporte e identificação dos volumes.',
  },
];

async function run() {
  await dataSource.initialize();
  const repository = dataSource.getRepository(ChecklistItemDefinitionOrmEntity);

  for (const item of items) {
    const existing = await repository.findOne({ where: { code: item.code } });
    if (existing) {
      console.log(`Skipping existing checklist item: ${item.code}`);
      continue;
    }

    await repository.save(repository.create(item));
    console.log(`Created checklist item: ${item.code}`);
  }

  await dataSource.destroy();
}

run().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
