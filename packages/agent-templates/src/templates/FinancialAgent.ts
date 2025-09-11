import { Agent, AgentCapability } from '../types/Agent';
import { createAgent } from '../utils/factories';

/**
 * Financial Agent Template
 * 
 * Based on hackathon analysis showing Finance as a top domain
 * Provides market analysis, portfolio tracking, risk assessment, and investment recommendations
 */
export class FinancialAgent {
  private agent: Agent;
  private marketService?: any;
  private portfolioService?: any;
  private riskService?: any;

  constructor(config: FinancialAgentConfig) {
    this.agent = createAgent(
      'Financial Agent',
      'financial',
      this.getCapabilities(),
      {
        author: 'Agent Labs',
        description: 'A comprehensive financial agent for market analysis, portfolio management, and investment insights',
        tags: ['finance', 'trading', 'portfolio', 'market-analysis', 'risk-assessment'],
        category: 'finance'
      }
    );

    this.initializeServices(config);
  }

  /**
   * Get agent capabilities
   */
  private getCapabilities(): AgentCapability[] {
    return [
      {
        name: 'analyze_market',
        description: 'Analyze market trends and conditions',
        inputSchema: {
          type: 'object',
          properties: {
            symbols: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Stock symbols to analyze (e.g., ["AAPL", "GOOGL"])'
            },
            timeframe: { 
              type: 'string', 
              enum: ['1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max'],
              default: '1mo',
              description: 'Analysis timeframe'
            },
            indicators: {
              type: 'array',
              items: { type: 'string' },
              description: 'Technical indicators to calculate (RSI, MACD, SMA, etc.)'
            }
          },
          required: ['symbols']
        },
        outputSchema: {
          type: 'object',
          properties: {
            analysis: {
              type: 'object',
              properties: {
                trend: { type: 'string', enum: ['bullish', 'bearish', 'neutral'] },
                confidence: { type: 'number', minimum: 0, maximum: 100 },
                keyLevels: { type: 'array', items: { type: 'number' } },
                recommendations: { type: 'array', items: { type: 'string' } }
              }
            },
            technicalIndicators: { type: 'object' },
            marketSentiment: { type: 'string' }
          }
        },
        required: true
      },
      {
        name: 'track_portfolio',
        description: 'Track and analyze portfolio performance',
        inputSchema: {
          type: 'object',
          properties: {
            portfolioId: { type: 'string', description: 'Portfolio identifier' },
            includeMetrics: { type: 'boolean', default: true, description: 'Include performance metrics' },
            benchmark: { type: 'string', description: 'Benchmark index for comparison' }
          },
          required: ['portfolioId']
        },
        outputSchema: {
          type: 'object',
          properties: {
            portfolio: {
              type: 'object',
              properties: {
                totalValue: { type: 'number' },
                totalReturn: { type: 'number' },
                totalReturnPercent: { type: 'number' },
                dailyChange: { type: 'number' },
                dailyChangePercent: { type: 'number' }
              }
            },
            holdings: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  symbol: { type: 'string' },
                  quantity: { type: 'number' },
                  currentPrice: { type: 'number' },
                  marketValue: { type: 'number' },
                  gainLoss: { type: 'number' },
                  gainLossPercent: { type: 'number' }
                }
              }
            },
            performance: {
              type: 'object',
              properties: {
                sharpeRatio: { type: 'number' },
                maxDrawdown: { type: 'number' },
                volatility: { type: 'number' },
                beta: { type: 'number' }
              }
            }
          }
        },
        required: true
      },
      {
        name: 'assess_risk',
        description: 'Assess portfolio or investment risk',
        inputSchema: {
          type: 'object',
          properties: {
            portfolioId: { type: 'string', description: 'Portfolio identifier' },
            riskTolerance: { 
              type: 'string', 
              enum: ['conservative', 'moderate', 'aggressive'],
              default: 'moderate',
              description: 'Risk tolerance level'
            },
            timeHorizon: { type: 'number', description: 'Investment time horizon in years' }
          },
          required: ['portfolioId']
        },
        outputSchema: {
          type: 'object',
          properties: {
            riskScore: { type: 'number', minimum: 0, maximum: 100 },
            riskLevel: { type: 'string', enum: ['low', 'medium', 'high', 'very-high'] },
            riskFactors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  factor: { type: 'string' },
                  impact: { type: 'string', enum: ['low', 'medium', 'high'] },
                  description: { type: 'string' }
                }
              }
            },
            recommendations: { type: 'array', items: { type: 'string' } }
          }
        },
        required: true
      },
      {
        name: 'get_investment_recommendations',
        description: 'Get personalized investment recommendations',
        inputSchema: {
          type: 'object',
          properties: {
            portfolioId: { type: 'string', description: 'Portfolio identifier' },
            investmentAmount: { type: 'number', description: 'Amount to invest' },
            riskTolerance: { 
              type: 'string', 
              enum: ['conservative', 'moderate', 'aggressive'],
              default: 'moderate'
            },
            investmentGoals: {
              type: 'array',
              items: { type: 'string' },
              description: 'Investment goals (growth, income, preservation, etc.)'
            },
            timeHorizon: { type: 'number', description: 'Investment time horizon in years' }
          },
          required: ['portfolioId', 'investmentAmount']
        },
        outputSchema: {
          type: 'object',
          properties: {
            recommendations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  symbol: { type: 'string' },
                  name: { type: 'string' },
                  allocation: { type: 'number', description: 'Recommended allocation percentage' },
                  amount: { type: 'number', description: 'Recommended investment amount' },
                  rationale: { type: 'string' },
                  riskLevel: { type: 'string' },
                  expectedReturn: { type: 'number' }
                }
              }
            },
            portfolioAllocation: {
              type: 'object',
              properties: {
                stocks: { type: 'number' },
                bonds: { type: 'number' },
                alternatives: { type: 'number' },
                cash: { type: 'number' }
              }
            },
            expectedPerformance: {
              type: 'object',
              properties: {
                expectedReturn: { type: 'number' },
                expectedVolatility: { type: 'number' },
                sharpeRatio: { type: 'number' }
              }
            }
          }
        },
        required: true
      },
      {
        name: 'monitor_news',
        description: 'Monitor financial news and market events',
        inputSchema: {
          type: 'object',
          properties: {
            symbols: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Stock symbols to monitor'
            },
            keywords: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Keywords to track in news'
            },
            timeframe: { 
              type: 'string', 
              enum: ['1h', '4h', '1d', '3d', '1w'],
              default: '1d',
              description: 'News monitoring timeframe'
            },
            sentiment: { type: 'boolean', default: true, description: 'Include sentiment analysis' }
          }
        },
        outputSchema: {
          type: 'object',
          properties: {
            news: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  summary: { type: 'string' },
                  url: { type: 'string' },
                  publishedAt: { type: 'string', format: 'date-time' },
                  sentiment: { type: 'string', enum: ['positive', 'negative', 'neutral'] },
                  relevance: { type: 'number', minimum: 0, maximum: 100 },
                  symbols: { type: 'array', items: { type: 'string' } }
                }
              }
            },
            marketImpact: { type: 'string', enum: ['low', 'medium', 'high'] },
            summary: { type: 'string' }
          }
        },
        required: true
      },
      {
        name: 'calculate_metrics',
        description: 'Calculate financial metrics and ratios',
        inputSchema: {
          type: 'object',
          properties: {
            symbols: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Stock symbols to analyze'
            },
            metrics: {
              type: 'array',
              items: { 
                type: 'string',
                enum: ['pe_ratio', 'pb_ratio', 'debt_to_equity', 'roe', 'roa', 'current_ratio', 'quick_ratio']
              },
              description: 'Financial metrics to calculate'
            },
            period: { 
              type: 'string', 
              enum: ['quarterly', 'yearly'],
              default: 'yearly',
              description: 'Reporting period'
            }
          },
          required: ['symbols', 'metrics']
        },
        outputSchema: {
          type: 'object',
          properties: {
            metrics: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  symbol: { type: 'string' },
                  metric: { type: 'string' },
                  value: { type: 'number' },
                  industryAverage: { type: 'number' },
                  interpretation: { type: 'string' }
                }
              }
            },
            analysis: { type: 'string' }
          }
        },
        required: true
      }
    ];
  }

  /**
   * Initialize external services
   */
  private initializeServices(config: FinancialAgentConfig): void {
    if (config.marketData) {
      this.marketService = new MarketDataService(config.marketData);
    }
    if (config.portfolio) {
      this.portfolioService = new PortfolioService(config.portfolio);
    }
    if (config.risk) {
      this.riskService = new RiskService(config.risk);
    }
  }

  /**
   * Get the agent instance
   */
  getAgent(): Agent {
    return this.agent;
  }

  /**
   * Execute a capability
   */
  async executeCapability(capabilityName: string, parameters: any): Promise<any> {
    switch (capabilityName) {
      case 'analyze_market':
        return this.analyzeMarket(parameters);
      case 'track_portfolio':
        return this.trackPortfolio(parameters);
      case 'assess_risk':
        return this.assessRisk(parameters);
      case 'get_investment_recommendations':
        return this.getInvestmentRecommendations(parameters);
      case 'monitor_news':
        return this.monitorNews(parameters);
      case 'calculate_metrics':
        return this.calculateMetrics(parameters);
      default:
        throw new Error(`Unknown capability: ${capabilityName}`);
    }
  }

  /**
   * Analyze market trends
   */
  private async analyzeMarket(params: any): Promise<any> {
    if (!this.marketService) {
      throw new Error('Market data service not configured');
    }

    const analysis = await this.marketService.analyzeTrends(
      params.symbols,
      params.timeframe,
      params.indicators
    );

    return {
      analysis: {
        trend: analysis.trend,
        confidence: analysis.confidence,
        keyLevels: analysis.keyLevels,
        recommendations: analysis.recommendations
      },
      technicalIndicators: analysis.indicators,
      marketSentiment: analysis.sentiment
    };
  }

  /**
   * Track portfolio performance
   */
  private async trackPortfolio(params: any): Promise<any> {
    if (!this.portfolioService) {
      throw new Error('Portfolio service not configured');
    }

    const portfolio = await this.portfolioService.getPortfolio(params.portfolioId);
    const performance = await this.portfolioService.calculatePerformance(
      params.portfolioId,
      params.benchmark
    );

    return {
      portfolio: {
        totalValue: portfolio.totalValue,
        totalReturn: performance.totalReturn,
        totalReturnPercent: performance.totalReturnPercent,
        dailyChange: performance.dailyChange,
        dailyChangePercent: performance.dailyChangePercent
      },
      holdings: portfolio.holdings,
      performance: {
        sharpeRatio: performance.sharpeRatio,
        maxDrawdown: performance.maxDrawdown,
        volatility: performance.volatility,
        beta: performance.beta
      }
    };
  }

  /**
   * Assess risk
   */
  private async assessRisk(params: any): Promise<any> {
    if (!this.riskService) {
      throw new Error('Risk service not configured');
    }

    const riskAssessment = await this.riskService.assessPortfolioRisk(
      params.portfolioId,
      params.riskTolerance,
      params.timeHorizon
    );

    return {
      riskScore: riskAssessment.score,
      riskLevel: riskAssessment.level,
      riskFactors: riskAssessment.factors,
      recommendations: riskAssessment.recommendations
    };
  }

  /**
   * Get investment recommendations
   */
  private async getInvestmentRecommendations(params: any): Promise<any> {
    if (!this.portfolioService) {
      throw new Error('Portfolio service not configured');
    }

    const recommendations = await this.portfolioService.generateRecommendations({
      portfolioId: params.portfolioId,
      investmentAmount: params.investmentAmount,
      riskTolerance: params.riskTolerance,
      goals: params.investmentGoals,
      timeHorizon: params.timeHorizon
    });

    return {
      recommendations: recommendations.stocks,
      portfolioAllocation: recommendations.allocation,
      expectedPerformance: recommendations.performance
    };
  }

  /**
   * Monitor financial news
   */
  private async monitorNews(params: any): Promise<any> {
    if (!this.marketService) {
      throw new Error('Market data service not configured');
    }

    const news = await this.marketService.getNews(
      params.symbols,
      params.keywords,
      params.timeframe,
      params.sentiment
    );

    return {
      news: news.articles,
      marketImpact: news.impact,
      summary: news.summary
    };
  }

  /**
   * Calculate financial metrics
   */
  private async calculateMetrics(params: any): Promise<any> {
    if (!this.marketService) {
      throw new Error('Market data service not configured');
    }

    const metrics = await this.marketService.calculateFinancialMetrics(
      params.symbols,
      params.metrics,
      params.period
    );

    return {
      metrics: metrics.data,
      analysis: metrics.analysis
    };
  }
}

/**
 * Configuration interface for Financial Agent
 */
export interface FinancialAgentConfig {
  marketData?: {
    provider: 'yahoo' | 'alpha_vantage' | 'polygon' | 'mock';
    apiKey?: string;
  };
  portfolio?: {
    provider: 'brokerage' | 'local' | 'mock';
    credentials?: any;
  };
  risk?: {
    provider: 'internal' | 'external' | 'mock';
    model?: string;
  };
}

/**
 * Mock services for demonstration
 */
class MarketDataService {
  constructor(private config: any) {}

  async analyzeTrends(symbols: string[], timeframe: string, indicators: string[]): Promise<any> {
    // Mock implementation
    return {
      trend: 'bullish',
      confidence: 75,
      keyLevels: [150, 160, 170],
      recommendations: ['Hold current position', 'Consider taking profits at $170'],
      indicators: { RSI: 65, MACD: 'positive' },
      sentiment: 'positive'
    };
  }

  async getNews(symbols: string[], keywords: string[], timeframe: string, sentiment: boolean): Promise<any> {
    // Mock implementation
    return {
      articles: [],
      impact: 'low',
      summary: 'No significant news in the specified timeframe'
    };
  }

  async calculateFinancialMetrics(symbols: string[], metrics: string[], period: string): Promise<any> {
    // Mock implementation
    return {
      data: [],
      analysis: 'Financial metrics calculated successfully'
    };
  }
}

class PortfolioService {
  constructor(private config: any) {}

  async getPortfolio(portfolioId: string): Promise<any> {
    // Mock implementation
    return {
      totalValue: 100000,
      holdings: []
    };
  }

  async calculatePerformance(portfolioId: string, benchmark?: string): Promise<any> {
    // Mock implementation
    return {
      totalReturn: 5000,
      totalReturnPercent: 5.0,
      dailyChange: 100,
      dailyChangePercent: 0.1,
      sharpeRatio: 1.2,
      maxDrawdown: -0.05,
      volatility: 0.15,
      beta: 1.1
    };
  }

  async generateRecommendations(params: any): Promise<any> {
    // Mock implementation
    return {
      stocks: [],
      allocation: { stocks: 60, bonds: 30, alternatives: 5, cash: 5 },
      performance: { expectedReturn: 0.08, expectedVolatility: 0.12, sharpeRatio: 0.67 }
    };
  }
}

class RiskService {
  constructor(private config: any) {}

  async assessPortfolioRisk(portfolioId: string, riskTolerance: string, timeHorizon?: number): Promise<any> {
    // Mock implementation
    return {
      score: 65,
      level: 'medium',
      factors: [],
      recommendations: ['Consider diversifying across sectors']
    };
  }
}
