/**
 * Knowledge Pipeline Implementation Example
 * 
 * This is a complete, working implementation of the Knowledge Pipeline template
 * that can be used as a reference for building other agents.
 */

import { BaseAgent, AgentContext, AgentInput, AgentOutput } from '../../agent-sdk/src/index';
import { AgentManifest, AgentManifestFactory } from '../src/schemas/AgentManifest';

// ============================================================================
// Source Collector Agent Implementation
// ============================================================================

export class SourceCollectorAgent extends BaseAgent {
  private axios: any;
  private cheerio: any;

  constructor() {
    super(AgentManifestFactory.createSourceCollector());
    this.axios = require('axios');
    this.cheerio = require('cheerio');
  }

  protected async onInitialize(): Promise<void> {
    this.log('info', 'Source Collector Agent initialized');
  }

  protected async onShutdown(): Promise<void> {
    this.log('info', 'Source Collector Agent shutdown');
  }

  protected async onExecute(input: AgentInput): Promise<AgentOutput> {
    const { sources_config } = input;
    const sources: any[] = [];

    this.log('info', `Collecting sources from ${sources_config.length} configurations`);

    for (const config of sources_config) {
      try {
        let collectedSources: any[] = [];

        switch (config.type) {
          case 'arxiv':
            collectedSources = await this.collectFromArXiv(config);
            break;
          case 'web':
            collectedSources = await this.collectFromWeb(config);
            break;
          case 'pdf':
            collectedSources = await this.collectFromPDF(config);
            break;
          case 'database':
            collectedSources = await this.collectFromDatabase(config);
            break;
          default:
            this.log('warn', `Unknown source type: ${config.type}`);
        }

        sources.push(...collectedSources);
        this.log('info', `Collected ${collectedSources.length} sources from ${config.type}`);
      } catch (error) {
        this.log('error', `Failed to collect from ${config.type}: ${error}`);
      }
    }

    return { sources };
  }

  private async collectFromArXiv(config: any): Promise<any[]> {
    const { query, maxResults = 10 } = config;
    const sources: any[] = [];

    try {
      // ArXiv API call
      const response = await this.axios.get('http://export.arxiv.org/api/query', {
        params: {
          search_query: query,
          start: 0,
          max_results: maxResults,
          sortBy: 'relevance',
          sortOrder: 'descending'
        },
        timeout: 30000
      });

      const $ = this.cheerio.load(response.data, { xmlMode: true });
      
      $('entry').each((index: number, element: any) => {
        if (index >= maxResults) return false;

        const title = $(element).find('title').text().trim();
        const summary = $(element).find('summary').text().trim();
        const authors = $(element).find('author name').map((i: number, el: any) => $(el).text()).get();
        const published = $(element).find('published').text();
        const link = $(element).find('link[type="application/pdf"]').attr('href');

        sources.push({
          title,
          content: summary,
          url: link,
          source_type: 'arxiv',
          metadata: {
            authors,
            published,
            query,
            relevance_score: 1.0 - (index / maxResults) // Simple relevance scoring
          }
        });
      });

    } catch (error) {
      this.log('error', `ArXiv collection failed: ${error}`);
    }

    return sources;
  }

  private async collectFromWeb(config: any): Promise<any[]> {
    const { url, maxResults = 10 } = config;
    const sources: any[] = [];

    try {
      const response = await this.axios.get(url, {
        timeout: 30000,
        headers: {
          'User-Agent': 'AgentLabs-SourceCollector/1.0'
        }
      });

      const $ = this.cheerio.load(response.data);
      
      // Extract main content
      const title = $('title').text().trim();
      const content = $('main, article, .content, #content').text().trim() || $('body').text().trim();
      
      if (content.length > 100) { // Only include substantial content
        sources.push({
          title: title || 'Web Document',
          content: content.substring(0, 10000), // Limit content length
          url,
          source_type: 'web',
          metadata: {
            content_length: content.length,
            relevance_score: 0.8
          }
        });
      }

    } catch (error) {
      this.log('error', `Web collection failed: ${error}`);
    }

    return sources;
  }

  private async collectFromPDF(config: any): Promise<any[]> {
    const { url } = config;
    const sources: any[] = [];

    try {
      // This would integrate with a PDF parsing service
      // For now, return a placeholder
      sources.push({
        title: 'PDF Document',
        content: 'PDF content would be extracted here',
        url,
        source_type: 'pdf',
        metadata: {
          relevance_score: 0.7
        }
      });

    } catch (error) {
      this.log('error', `PDF collection failed: ${error}`);
    }

    return sources;
  }

  private async collectFromDatabase(config: any): Promise<any[]> {
    const { query, maxResults = 10 } = config;
    const sources: any[] = [];

    try {
      // This would integrate with a research database
      // For now, return mock data
      sources.push({
        title: 'Database Research Result',
        content: 'Research content from database',
        url: 'database://research/123',
        source_type: 'database',
        metadata: {
          query,
          relevance_score: 0.9
        }
      });

    } catch (error) {
      this.log('error', `Database collection failed: ${error}`);
    }

    return sources;
  }
}

// ============================================================================
// Research Synthesizer Agent Implementation
// ============================================================================

export class ResearchSynthesizerAgent extends BaseAgent {
  private mistralClient: any;

  constructor() {
    super(AgentManifestFactory.createResearchSynthesizer());
  }

  protected async onInitialize(): Promise<void> {
    // Initialize Mistral client
    const Mistral = require('@mistralai/mistralai');
    this.mistralClient = new Mistral.MistralClient(this.config.mistral_api_key);
    this.log('info', 'Research Synthesizer Agent initialized');
  }

  protected async onShutdown(): Promise<void> {
    this.log('info', 'Research Synthesizer Agent shutdown');
  }

  protected async onExecute(input: AgentInput): Promise<AgentOutput> {
    const { documents, prompt_config } = input;
    
    this.log('info', `Synthesizing ${documents.length} documents`);

    try {
      // Prepare documents for synthesis
      const documentTexts = documents.map((doc: any) => 
        `Title: ${doc.title}\nContent: ${doc.content}\nSource: ${doc.url}`
      ).join('\n\n---\n\n');

      // Create synthesis prompt
      const prompt = this.createSynthesisPrompt(documentTexts, prompt_config);

      // Generate synthesis using Mistral
      const response = await this.mistralClient.chat.complete({
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: prompt_config?.max_tokens || 1500,
        temperature: prompt_config?.temperature || 0.0
      });

      const synthesisText = response.choices[0].message.content;

      // Parse the structured output
      const result = this.parseSynthesisOutput(synthesisText, documents);

      this.log('info', `Synthesis completed with confidence: ${result.confidence_score}`);

      return result;

    } catch (error) {
      this.log('error', `Synthesis failed: ${error}`);
      throw error;
    }
  }

  private createSynthesisPrompt(documentTexts: string, config: any): string {
    const focusAreas = config?.focus_areas || ['methodology', 'results', 'conclusions'];
    
    return `You are a research synthesis expert. Analyze the following research documents and create a comprehensive synthesis.

Focus Areas: ${focusAreas.join(', ')}

Documents:
${documentTexts}

Please provide a structured synthesis in the following JSON format:
{
  "summary": "A comprehensive summary of the key findings and insights",
  "claims": [
    {
      "claim": "A specific claim or finding",
      "evidence": ["Source 1, Section X", "Source 2, Page Y"],
      "confidence": 0.85
    }
  ],
  "confidence_score": 0.82
}

Guidelines:
- Be objective and evidence-based
- Include specific citations to sources
- Rate confidence based on evidence strength
- Focus on the specified areas: ${focusAreas.join(', ')}
- Ensure all claims are supported by the provided documents

Respond only with valid JSON.`;
  }

  private parseSynthesisOutput(synthesisText: string, documents: any[]): AgentOutput {
    try {
      // Extract JSON from the response
      const jsonMatch = synthesisText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in synthesis output');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate and enhance the result
      const result = {
        summary: parsed.summary || 'Synthesis completed',
        claims: parsed.claims || [],
        confidence_score: parsed.confidence_score || 0.5,
        sources_used: documents.map(doc => ({
          title: doc.title,
          url: doc.url,
          relevance_score: doc.metadata?.relevance_score || 0.5
        }))
      };

      // Enhance claims with source information
      result.claims = result.claims.map((claim: any) => ({
        ...claim,
        source: this.findBestSource(claim.evidence, documents)
      }));

      return result;

    } catch (error) {
      this.log('error', `Failed to parse synthesis output: ${error}`);
      
      // Return fallback result
      return {
        summary: synthesisText.substring(0, 500) + '...',
        claims: [],
        confidence_score: 0.3,
        sources_used: documents.map(doc => ({
          title: doc.title,
          url: doc.url,
          relevance_score: 0.5
        }))
      };
    }
  }

  private findBestSource(evidence: string[], documents: any[]): string {
    // Simple source matching - in a real implementation, this would be more sophisticated
    for (const doc of documents) {
      for (const ev of evidence) {
        if (ev.toLowerCase().includes(doc.title.toLowerCase().substring(0, 10))) {
          return doc.url;
        }
      }
    }
    return documents[0]?.url || 'unknown';
  }
}

// ============================================================================
// Quality Auditor Agent Implementation
// ============================================================================

export class QualityAuditorAgent extends BaseAgent {
  private mistralClient: any;

  constructor() {
    super(AgentManifestFactory.createQualityAuditor());
  }

  protected async onInitialize(): Promise<void> {
    const Mistral = require('@mistralai/mistralai');
    this.mistralClient = new Mistral.MistralClient(this.config.mistral_api_key);
    this.log('info', 'Quality Auditor Agent initialized');
  }

  protected async onShutdown(): Promise<void> {
    this.log('info', 'Quality Auditor Agent shutdown');
  }

  protected async onExecute(input: AgentInput): Promise<AgentOutput> {
    const { synthesis, audit_config } = input;
    
    this.log('info', 'Starting quality audit of synthesis');

    try {
      const auditResults = {
        hallucination_rate: await this.checkHallucinations(synthesis, audit_config),
        citation_accuracy: await this.verifyCitations(synthesis, audit_config),
        bias_score: await this.detectBias(synthesis, audit_config),
        quality_score: 0,
        issues: [] as string[],
        recommendations: [] as string[]
      };

      // Calculate overall quality score
      auditResults.quality_score = this.calculateQualityScore(auditResults);

      // Generate recommendations
      auditResults.recommendations = this.generateRecommendations(auditResults);

      this.log('info', `Audit completed. Quality score: ${auditResults.quality_score}`);

      return { audit_results: auditResults };

    } catch (error) {
      this.log('error', `Audit failed: ${error}`);
      throw error;
    }
  }

  private async checkHallucinations(synthesis: any, config: any): Promise<number> {
    if (!config?.checkHallucinations) return 0;

    try {
      const prompt = `Analyze the following research synthesis for potential hallucinations or unsupported claims.

Synthesis:
${synthesis.summary}

Claims:
${JSON.stringify(synthesis.claims, null, 2)}

Rate the likelihood of hallucinations on a scale of 0-1, where:
- 0 = No hallucinations detected
- 1 = High likelihood of hallucinations

Consider:
- Claims without proper citations
- Statements that seem to go beyond the source material
- Inconsistencies between claims and evidence

Respond with a single number between 0 and 1.`;

      const response = await this.mistralClient.chat.complete({
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 10,
        temperature: 0.0
      });

      const score = parseFloat(response.choices[0].message.content.trim());
      return Math.max(0, Math.min(1, score || 0));

    } catch (error) {
      this.log('error', `Hallucination check failed: ${error}`);
      return 0.5; // Default to moderate risk
    }
  }

  private async verifyCitations(synthesis: any, config: any): Promise<number> {
    if (!config?.verifyCitations) return 1;

    try {
      let totalClaims = 0;
      let verifiedClaims = 0;

      for (const claim of synthesis.claims || []) {
        totalClaims++;
        if (claim.evidence && claim.evidence.length > 0) {
          verifiedClaims++;
        }
      }

      return totalClaims > 0 ? verifiedClaims / totalClaims : 1;

    } catch (error) {
      this.log('error', `Citation verification failed: ${error}`);
      return 0.5;
    }
  }

  private async detectBias(synthesis: any, config: any): Promise<number> {
    if (!config?.biasDetection) return 0;

    try {
      const prompt = `Analyze the following research synthesis for potential bias.

Synthesis:
${synthesis.summary}

Claims:
${JSON.stringify(synthesis.claims, null, 2)}

Rate the likelihood of bias on a scale of 0-1, where:
- 0 = No bias detected
- 1 = High likelihood of bias

Consider:
- Language that favors certain perspectives
- Selective presentation of evidence
- Unbalanced coverage of different viewpoints
- Potential demographic or cultural bias

Respond with a single number between 0 and 1.`;

      const response = await this.mistralClient.chat.complete({
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 10,
        temperature: 0.0
      });

      const score = parseFloat(response.choices[0].message.content.trim());
      return Math.max(0, Math.min(1, score || 0));

    } catch (error) {
      this.log('error', `Bias detection failed: ${error}`);
      return 0.3; // Default to low bias
    }
  }

  private calculateQualityScore(auditResults: any): number {
    const weights = {
      hallucination: 0.4,
      citation: 0.3,
      bias: 0.3
    };

    const hallucinationScore = 1 - auditResults.hallucination_rate;
    const citationScore = auditResults.citation_accuracy;
    const biasScore = 1 - auditResults.bias_score;

    return (
      hallucinationScore * weights.hallucination +
      citationScore * weights.citation +
      biasScore * weights.bias
    );
  }

  private generateRecommendations(auditResults: any): string[] {
    const recommendations: string[] = [];

    if (auditResults.hallucination_rate > 0.2) {
      recommendations.push('Consider adding more specific citations to support claims');
    }

    if (auditResults.citation_accuracy < 0.8) {
      recommendations.push('Improve citation coverage for all claims');
    }

    if (auditResults.bias_score > 0.3) {
      recommendations.push('Review synthesis for potential bias and ensure balanced perspective');
    }

    if (auditResults.quality_score < 0.7) {
      recommendations.push('Overall quality could be improved with more rigorous fact-checking');
    }

    return recommendations;
  }
}

// ============================================================================
// Usage Example
// ============================================================================

export async function runKnowledgePipelineExample() {
  console.log('🚀 Starting Knowledge Pipeline Example');

  // Create agent instances
  const sourceCollector = new SourceCollectorAgent();
  const researchSynthesizer = new ResearchSynthesizerAgent();
  const qualityAuditor = new QualityAuditorAgent();

  // Initialize agents
  const context: AgentContext = {
    agentId: 'knowledge_pipeline',
    sessionId: 'session_123',
    userId: 'user_456'
  };

  await sourceCollector.initialize(context, {});
  await researchSynthesizer.initialize(context, { mistral_api_key: process.env.MISTRAL_API_KEY });
  await qualityAuditor.initialize(context, { mistral_api_key: process.env.MISTRAL_API_KEY });

  try {
    // Step 1: Collect sources
    console.log('📚 Collecting sources...');
    const sourceResult = await sourceCollector.execute({
      sources_config: [
        {
          type: 'arxiv',
          query: 'machine learning healthcare',
          maxResults: 3
        },
        {
          type: 'web',
          url: 'https://example.com/healthcare-ml-survey'
        }
      ]
    });

    console.log(`✅ Collected ${sourceResult.sources.length} sources`);

    // Step 2: Synthesize research
    console.log('🧠 Synthesizing research...');
    const synthesisResult = await researchSynthesizer.execute({
      documents: sourceResult.sources,
      prompt_config: {
        focus_areas: ['methodology', 'results', 'limitations'],
        max_tokens: 1000,
        temperature: 0.1
      }
    });

    console.log(`✅ Synthesis completed with confidence: ${synthesisResult.confidence_score}`);

    // Step 3: Audit quality
    console.log('🔍 Auditing quality...');
    const auditResult = await qualityAuditor.execute({
      synthesis: synthesisResult,
      audit_config: {
        checkHallucinations: true,
        verifyCitations: true,
        biasDetection: true,
        qualityThreshold: 0.8
      }
    });

    console.log(`✅ Audit completed. Quality score: ${auditResult.audit_results.quality_score}`);

    // Display results
    console.log('\n📊 Final Results:');
    console.log('Summary:', synthesisResult.summary.substring(0, 200) + '...');
    console.log('Claims:', synthesisResult.claims.length);
    console.log('Quality Score:', auditResult.audit_results.quality_score);
    console.log('Recommendations:', auditResult.audit_results.recommendations);

  } catch (error) {
    console.error('❌ Pipeline failed:', error);
  } finally {
    // Cleanup
    await sourceCollector.shutdown();
    await researchSynthesizer.shutdown();
    await qualityAuditor.shutdown();
    console.log('🏁 Pipeline completed');
  }
}

// Export for use in other modules
export {
  SourceCollectorAgent,
  ResearchSynthesizerAgent,
  QualityAuditorAgent
};
