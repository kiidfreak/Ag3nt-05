/**
 * Knowledge Pipeline Template
 * AI Researcher → Summarizer → Auditor
 * 
 * This template demonstrates a complete research synthesis pipeline
 * that can ingest multiple sources, synthesize findings, and audit for quality.
 */

import { AgentManifest, AgentManifestFactory } from '../schemas/AgentManifest';

export interface KnowledgePipelineConfig {
  sources: {
    type: 'arxiv' | 'web' | 'pdf' | 'database';
    url?: string;
    query?: string;
    maxResults?: number;
  }[];
  synthesis: {
    focusAreas: string[];
    maxTokens: number;
    temperature: number;
    includeCitations: boolean;
  };
  audit: {
    checkHallucinations: boolean;
    verifyCitations: boolean;
    biasDetection: boolean;
    qualityThreshold: number;
  };
}

export interface KnowledgePipelineResult {
  summary: string;
  claims: Array<{
    claim: string;
    evidence: string[];
    confidence: number;
    source: string;
  }>;
  confidence_score: number;
  audit_results: {
    hallucination_rate: number;
    citation_accuracy: number;
    bias_score: number;
    quality_score: number;
  };
  sources_used: Array<{
    title: string;
    url: string;
    relevance_score: number;
  }>;
}

/**
 * Source Collector Agent
 * Fetches research sources from various providers
 */
export const SourceCollectorManifest: AgentManifest = {
  id: 'source_collector_v1',
  name: 'Source Collector',
  version: '1.0.0',
  description: 'Collects research sources from ArXiv, web, PDFs, and databases',
  runtime: 'nodejs',
  inputs: {
    sources_config: {
      type: 'array',
      description: 'Configuration for source collection',
      required: true,
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['arxiv', 'web', 'pdf', 'database'] },
          url: { type: 'string', description: 'Source URL' },
          query: { type: 'string', description: 'Search query' },
          maxResults: { type: 'number', description: 'Maximum results to fetch', default: 10 }
        }
      }
    }
  },
  outputs: {
    sources: {
      type: 'array',
      description: 'Collected research sources',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          content: { type: 'text' },
          url: { type: 'string' },
          source_type: { type: 'string' },
          metadata: { type: 'object' }
        }
      }
    }
  },
  config: {
    timeout: {
      type: 'number',
      description: 'Request timeout in seconds',
      default: 30
    },
    rate_limit: {
      type: 'number',
      description: 'Requests per minute',
      default: 60
    }
  },
  security: {
    networkAccess: {
      allowedHosts: ['arxiv.org', 'scholar.google.com', 'pubmed.ncbi.nlm.nih.gov']
    },
    limits: {
      maxMemory: 256,
      maxExecutionTime: 300
    }
  },
  metadata: {
    author: {
      name: 'Agent Labs',
      email: 'team@agentlabs.ai',
      organization: 'Agent Labs'
    },
    tags: ['research', 'data-collection', 'sources'],
    category: 'data',
    keywords: ['arxiv', 'research', 'collection', 'sources']
  }
};

/**
 * Research Synthesizer Agent
 * Synthesizes multiple research sources into structured summaries
 */
export const ResearchSynthesizerManifest: AgentManifest = AgentManifestFactory.createResearchSynthesizer();

/**
 * Quality Auditor Agent
 * Audits synthesized content for quality, bias, and accuracy
 */
export const QualityAuditorManifest: AgentManifest = {
  id: 'quality_auditor_v1',
  name: 'Quality Auditor',
  version: '1.0.0',
  description: 'Audits research synthesis for quality, bias, and accuracy',
  runtime: 'nodejs',
  inputs: {
    synthesis: {
      type: 'object',
      description: 'Synthesized research content',
      required: true,
      properties: {
        summary: { type: 'text' },
        claims: { type: 'array', items: { type: 'object' } },
        sources: { type: 'array', items: { type: 'object' } }
      }
    },
    audit_config: {
      type: 'object',
      description: 'Audit configuration',
      properties: {
        checkHallucinations: { type: 'boolean', default: true },
        verifyCitations: { type: 'boolean', default: true },
        biasDetection: { type: 'boolean', default: true },
        qualityThreshold: { type: 'number', default: 0.8 }
      }
    }
  },
  outputs: {
    audit_results: {
      type: 'object',
      description: 'Audit results',
      properties: {
        hallucination_rate: { type: 'number', description: 'Rate of potential hallucinations' },
        citation_accuracy: { type: 'number', description: 'Citation accuracy score' },
        bias_score: { type: 'number', description: 'Bias detection score' },
        quality_score: { type: 'number', description: 'Overall quality score' },
        issues: { type: 'array', description: 'List of identified issues', items: { type: 'string' } },
        recommendations: { type: 'array', description: 'Recommendations for improvement', items: { type: 'string' } }
      }
    }
  },
  config: {
    hallucination_threshold: {
      type: 'number',
      description: 'Threshold for hallucination detection',
      default: 0.3
    },
    bias_threshold: {
      type: 'number',
      description: 'Threshold for bias detection',
      default: 0.2
    }
  },
  security: {
    limits: {
      maxMemory: 512,
      maxExecutionTime: 180
    }
  },
  metadata: {
    author: {
      name: 'Agent Labs',
      email: 'team@agentlabs.ai',
      organization: 'Agent Labs'
    },
    tags: ['audit', 'quality', 'bias', 'hallucination'],
    category: 'ai',
    keywords: ['audit', 'quality', 'bias', 'hallucination', 'verification']
  }
};

/**
 * Knowledge Pipeline Workflow Definition
 */
export const KnowledgePipelineWorkflow = {
  id: 'knowledge_pipeline_v1',
  name: 'Knowledge Pipeline',
  description: 'Complete research synthesis pipeline with quality auditing',
  version: '1.0.0',
  nodes: [
    {
      id: 'source_collector',
      type: 'agent',
      name: 'Source Collector',
      agentId: 'source_collector_v1',
      position: { x: 100, y: 100 },
      config: {
        timeout: 300,
        rate_limit: 60
      }
    },
    {
      id: 'research_synthesizer',
      type: 'agent',
      name: 'Research Synthesizer',
      agentId: 'research_synthesizer_v1',
      position: { x: 400, y: 100 },
      config: {
        llm_provider: 'mistral',
        max_tokens: 1500,
        temperature: 0.0
      }
    },
    {
      id: 'quality_auditor',
      type: 'agent',
      name: 'Quality Auditor',
      agentId: 'quality_auditor_v1',
      position: { x: 700, y: 100 },
      config: {
        checkHallucinations: true,
        verifyCitations: true,
        biasDetection: true,
        qualityThreshold: 0.8
      }
    }
  ],
  edges: [
    {
      id: 'collector_to_synthesizer',
      source: 'source_collector',
      target: 'research_synthesizer',
      dataMapping: {
        'sources': 'documents'
      }
    },
    {
      id: 'synthesizer_to_auditor',
      source: 'research_synthesizer',
      target: 'quality_auditor',
      dataMapping: {
        'summary': 'synthesis.summary',
        'claims': 'synthesis.claims',
        'sources_used': 'synthesis.sources'
      }
    }
  ],
  variables: [
    {
      name: 'sources_config',
      type: 'array',
      description: 'Source collection configuration',
      required: true
    },
    {
      name: 'synthesis_config',
      type: 'object',
      description: 'Synthesis configuration',
      default: {
        focusAreas: ['methodology', 'results', 'conclusions'],
        maxTokens: 1500,
        temperature: 0.0,
        includeCitations: true
      }
    }
  ]
};

/**
 * Example usage and test data
 */
export const KnowledgePipelineExamples = {
  academic_research: {
    name: 'Academic Research Synthesis',
    description: 'Synthesize multiple academic papers on machine learning',
    input: {
      sources_config: [
        {
          type: 'arxiv',
          query: 'machine learning healthcare',
          maxResults: 5
        },
        {
          type: 'web',
          url: 'https://example.com/healthcare-ml-survey.pdf'
        }
      ],
      synthesis_config: {
        focusAreas: ['methodology', 'results', 'limitations'],
        maxTokens: 2000,
        temperature: 0.1,
        includeCitations: true
      }
    },
    expected_output: {
      summary: 'A comprehensive synthesis of machine learning applications in healthcare...',
      claims: [
        {
          claim: 'ML improves diagnostic accuracy by 15-20%',
          evidence: ['Paper 1, Section 3.2', 'Paper 2, Table 1'],
          confidence: 0.85,
          source: 'arxiv:2023.12345'
        }
      ],
      confidence_score: 0.82,
      audit_results: {
        hallucination_rate: 0.05,
        citation_accuracy: 0.92,
        bias_score: 0.15,
        quality_score: 0.88
      }
    }
  },
  
  market_research: {
    name: 'Market Research Analysis',
    description: 'Analyze market research reports and synthesize insights',
    input: {
      sources_config: [
        {
          type: 'web',
          url: 'https://example.com/market-report-2024.pdf'
        },
        {
          type: 'database',
          query: 'market trends AI 2024',
          maxResults: 10
        }
      ],
      synthesis_config: {
        focusAreas: ['trends', 'opportunities', 'risks'],
        maxTokens: 1500,
        temperature: 0.2,
        includeCitations: true
      }
    },
    expected_output: {
      summary: 'Market analysis reveals significant growth opportunities in AI sector...',
      claims: [
        {
          claim: 'AI market expected to grow 25% annually',
          evidence: ['Report 2024, Page 15', 'Database entry #123'],
          confidence: 0.78,
          source: 'market-report-2024'
        }
      ],
      confidence_score: 0.75,
      audit_results: {
        hallucination_rate: 0.08,
        citation_accuracy: 0.85,
        bias_score: 0.22,
        quality_score: 0.82
      }
    }
  }
};

/**
 * Database schema for Knowledge Pipeline
 */
export const KnowledgePipelineDatabaseSchema = {
  documents: `
    CREATE TABLE documents (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      url TEXT,
      source_type VARCHAR(50) NOT NULL,
      metadata JSONB,
      ingested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      vector VECTOR(1536) -- For embeddings
    );
    
    CREATE INDEX idx_documents_source_type ON documents(source_type);
    CREATE INDEX idx_documents_ingested_at ON documents(ingested_at);
    CREATE INDEX idx_documents_vector ON documents USING ivfflat (vector vector_cosine_ops);
  `,
  
  syntheses: `
    CREATE TABLE syntheses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      document_ids UUID[] NOT NULL,
      summary TEXT NOT NULL,
      claims JSONB NOT NULL,
      confidence_score FLOAT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_by UUID REFERENCES users(id)
    );
    
    CREATE INDEX idx_syntheses_created_at ON syntheses(created_at);
    CREATE INDEX idx_syntheses_confidence ON syntheses(confidence_score);
  `,
  
  audit_results: `
    CREATE TABLE audit_results (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      synthesis_id UUID REFERENCES syntheses(id),
      hallucination_rate FLOAT NOT NULL,
      citation_accuracy FLOAT NOT NULL,
      bias_score FLOAT NOT NULL,
      quality_score FLOAT NOT NULL,
      issues TEXT[],
      recommendations TEXT[],
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX idx_audit_results_synthesis_id ON audit_results(synthesis_id);
    CREATE INDEX idx_audit_results_quality_score ON audit_results(quality_score);
  `
};

/**
 * Event topics for Knowledge Pipeline
 */
export const KnowledgePipelineEvents = {
  'doc.ingested': {
    description: 'Document has been ingested and processed',
    schema: {
      doc_id: 'string',
      source: 'string',
      length: 'number',
      metadata: 'object'
    }
  },
  
  'synthesis.request': {
    description: 'Synthesis request initiated',
    schema: {
      doc_ids: 'array',
      user_id: 'string',
      params: 'object'
    }
  },
  
  'synthesis.complete': {
    description: 'Synthesis completed',
    schema: {
      synthesis_id: 'string',
      status: 'string',
      metrics: 'object'
    }
  },
  
  'audit.complete': {
    description: 'Quality audit completed',
    schema: {
      audit_id: 'string',
      synthesis_id: 'string',
      quality_score: 'number',
      issues: 'array'
    }
  }
};

export default {
  manifests: {
    SourceCollectorManifest,
    ResearchSynthesizerManifest,
    QualityAuditorManifest
  },
  workflow: KnowledgePipelineWorkflow,
  examples: KnowledgePipelineExamples,
  database: KnowledgePipelineDatabaseSchema,
  events: KnowledgePipelineEvents
};
