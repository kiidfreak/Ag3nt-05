/**
 * Voice Panel Component
 * AI-powered voice assistant with multilingual support (including Kiswahili)
 * Converts natural language requests into agent workflows
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Globe, 
  Brain, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Loader2,
  MessageSquare,
  Zap,
  Users,
  Building,
  Heart,
  Code,
  FileText
} from 'lucide-react';

interface VoicePanelProps {
  onWorkflowGenerated?: (workflow: any) => void;
  onGuidanceRequested?: (guidance: any) => void;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface WorkflowSuggestion {
  id: string;
  name: string;
  description: string;
  category: string;
  agents: string[];
  estimatedTime: string;
  complexity: 'simple' | 'medium' | 'complex';
  icon: React.ReactNode;
}

interface GuidanceStep {
  id: string;
  title: string;
  description: string;
  action: 'create_agent' | 'configure' | 'connect' | 'test' | 'deploy';
  completed: boolean;
  instructions: string[];
}

export const VoicePanel: React.FC<VoicePanelProps> = ({
  onWorkflowGenerated,
  onGuidanceRequested
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>({
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  });
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [workflowSuggestions, setWorkflowSuggestions] = useState<WorkflowSuggestion[]>([]);
  const [guidanceSteps, setGuidanceSteps] = useState<GuidanceStep[]>([]);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: 'user' | 'assistant';
    message: string;
    timestamp: Date;
    language: string;
  }>>([]);

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<any>(null);

  // Supported languages including Kiswahili
  const supportedLanguages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'sw', name: 'Kiswahili', nativeName: 'Kiswahili', flag: '🇹🇿' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' }
  ];

  // Pre-defined workflow templates
  const workflowTemplates: WorkflowSuggestion[] = [
    {
      id: 'research_pipeline',
      name: 'Research Pipeline',
      description: 'Collect, synthesize, and audit research documents',
      category: 'Knowledge',
      agents: ['Source Collector', 'Research Synthesizer', 'Quality Auditor'],
      estimatedTime: '5-10 minutes',
      complexity: 'medium',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'finance_decision',
      name: 'Financial Decision',
      description: 'Process loan applications with fairness auditing',
      category: 'Finance',
      agents: ['Bank Connector', 'Risk Scorer', 'Fairness Auditor', 'Decision Orchestrator'],
      estimatedTime: '3-7 minutes',
      complexity: 'complex',
      icon: <Building className="w-5 h-5" />
    },
    {
      id: 'healthcare_triage',
      name: 'Healthcare Triage',
      description: 'Patient intake and diagnosis assistance',
      category: 'Healthcare',
      agents: ['Intake Collector', 'Symptom Synthesizer', 'Risk Scorer', 'Treatment Orchestrator'],
      estimatedTime: '2-5 minutes',
      complexity: 'complex',
      icon: <Heart className="w-5 h-5" />
    },
    {
      id: 'dev_workflow',
      name: 'Developer Workflow',
      description: 'Automated code review and deployment',
      category: 'Development',
      agents: ['GitHub Connector', 'Static Analyzer', 'Test Runner', 'Deployment Orchestrator'],
      estimatedTime: '4-8 minutes',
      complexity: 'medium',
      icon: <Code className="w-5 h-5" />
    },
    {
      id: 'content_pipeline',
      name: 'Content Pipeline',
      description: 'Generate and audit brand-compliant content',
      category: 'Marketing',
      agents: ['Content Generator', 'Brand Voice Check', 'Compliance Auditor'],
      estimatedTime: '2-4 minutes',
      complexity: 'simple',
      icon: <MessageSquare className="w-5 h-5" />
    }
  ];

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Speech Recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = selectedLanguage.code;

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setTranscript(finalTranscript);
            processVoiceInput(finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
      }

      // Speech Synthesis
      if ('speechSynthesis' in window) {
        synthesisRef.current = window.speechSynthesis;
      }
    }
  }, [selectedLanguage]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      setTranscript('');
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const speak = useCallback((text: string) => {
    if (synthesisRef.current && !isSpeaking) {
      setIsSpeaking(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage.code;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      synthesisRef.current.speak(utterance);
    }
  }, [selectedLanguage, isSpeaking]);

  const processVoiceInput = async (input: string) => {
    setIsProcessing(true);
    
    // Add user message to conversation history
    const userMessage = {
      type: 'user' as const,
      message: input,
      timestamp: new Date(),
      language: selectedLanguage.code
    };
    setConversationHistory(prev => [...prev, userMessage]);

    try {
      // Process the input with AI to understand intent and generate workflow
      const result = await processNaturalLanguageInput(input, selectedLanguage.code);
      
      if (result.workflow) {
        setWorkflowSuggestions([result.workflow]);
        onWorkflowGenerated?.(result.workflow);
      }
      
      if (result.guidance) {
        setGuidanceSteps(result.guidance);
        onGuidanceRequested?.(result.guidance);
      }
      
      setResponse(result.response);
      
      // Add assistant response to conversation history
      const assistantMessage = {
        type: 'assistant' as const,
        message: result.response,
        timestamp: new Date(),
        language: selectedLanguage.code
      };
      setConversationHistory(prev => [...prev, assistantMessage]);
      
      // Speak the response
      speak(result.response);
      
    } catch (error) {
      console.error('Error processing voice input:', error);
      const errorResponse = getErrorMessage(selectedLanguage.code);
      setResponse(errorResponse);
      speak(errorResponse);
    } finally {
      setIsProcessing(false);
    }
  };

  const processNaturalLanguageInput = async (input: string, language: string) => {
    // This would integrate with a real AI service like OpenAI or Mistral
    // For now, we'll use pattern matching and templates
    
    const lowerInput = input.toLowerCase();
    
    // Detect workflow intent
    if (lowerInput.includes('research') || lowerInput.includes('tafiti') || lowerInput.includes('uchunguzi')) {
      return {
        workflow: workflowTemplates[0], // Research Pipeline
        response: getWorkflowResponse('research', language),
        guidance: generateGuidanceSteps('research_pipeline')
      };
    }
    
    if (lowerInput.includes('finance') || lowerInput.includes('fedha') || lowerInput.includes('loan') || lowerInput.includes('mkopo')) {
      return {
        workflow: workflowTemplates[1], // Finance Pipeline
        response: getWorkflowResponse('finance', language),
        guidance: generateGuidanceSteps('finance_pipeline')
      };
    }
    
    if (lowerInput.includes('health') || lowerInput.includes('afya') || lowerInput.includes('medical') || lowerInput.includes('hospital')) {
      return {
        workflow: workflowTemplates[2], // Healthcare Pipeline
        response: getWorkflowResponse('healthcare', language),
        guidance: generateGuidanceSteps('healthcare_pipeline')
      };
    }
    
    if (lowerInput.includes('code') || lowerInput.includes('developer') || lowerInput.includes('github') || lowerInput.includes('programming')) {
      return {
        workflow: workflowTemplates[3], // Developer Workflow
        response: getWorkflowResponse('development', language),
        guidance: generateGuidanceSteps('dev_workflow')
      };
    }
    
    if (lowerInput.includes('content') || lowerInput.includes('marketing') || lowerInput.includes('brand') || lowerInput.includes('ujumbe')) {
      return {
        workflow: workflowTemplates[4], // Content Pipeline
        response: getWorkflowResponse('content', language),
        guidance: generateGuidanceSteps('content_pipeline')
      };
    }
    
    // Default response
    return {
      response: getDefaultResponse(language),
      guidance: []
    };
  };

  const getWorkflowResponse = (type: string, language: string): string => {
    const responses = {
      en: {
        research: "I'll create a research pipeline that collects sources, synthesizes findings, and audits for quality. This workflow includes a Source Collector, Research Synthesizer, and Quality Auditor.",
        finance: "I'll set up a financial decision pipeline with bank connectivity, risk scoring, fairness auditing, and decision orchestration. This ensures fair and explainable loan decisions.",
        healthcare: "I'll create a healthcare triage system with patient intake, symptom analysis, risk assessment, and treatment coordination. This helps streamline patient care.",
        development: "I'll build a developer workflow that connects to GitHub, runs static analysis, executes tests, and handles deployment. This automates your CI/CD pipeline.",
        content: "I'll create a content pipeline that generates brand-compliant content, checks voice consistency, and ensures compliance. This streamlines your content creation process."
      },
      sw: {
        research: "Nitaunda mfumo wa utafiti ambao unakusanya vyanzo, unachanganua matokeo, na unachunguza ubora. Mfumo huu unajumuisha Mkusanyaji wa Vyanzo, Mchanganuzi wa Utafiti, na Mchunguzi wa Ubora.",
        finance: "Nitaweka mfumo wa maamuzi ya kifedha na muunganisho wa benki, upimaji wa hatari, uchunguzi wa haki, na uongozi wa maamuzi. Hii inahakikisha maamuzi ya mikopo yanayofaa na yanayoweza kuelezeka.",
        healthcare: "Nitaunda mfumo wa utunzaji wa afya na upokeaji wa wagonjwa, uchambuzi wa dalili, tathmini ya hatari, na uratibu wa matibabu. Hii inasaidia kuboresha huduma ya wagonjwa.",
        development: "Nitaunda mfumo wa msanidi programu ambao unahusiana na GitHub, unarun uchambuzi wa tuli, unatekeleza majaribio, na unashughulikia utekelezaji. Hii inaendesha mfumo wako wa CI/CD.",
        content: "Nitaunda mfumo wa maudhui ambao unatengeneza maudhui yanayofaa na chapa, unachunguza uthabiti wa sauti, na unahakikisha utii. Hii inaboresha mchakato wako wa kuunda maudhui."
      }
    };
    
    return responses[language as keyof typeof responses]?.[type as keyof typeof responses.en] || responses.en[type as keyof typeof responses.en];
  };

  const getDefaultResponse = (language: string): string => {
    const responses = {
      en: "I can help you create workflows for research, finance, healthcare, development, or content. Just tell me what you'd like to build!",
      sw: "Naweza kukusaidia kuunda mifumo ya utafiti, fedha, afya, maendeleo, au maudhui. Niambie tu unataka kujenga nini!",
      es: "Puedo ayudarte a crear flujos de trabajo para investigación, finanzas, salud, desarrollo o contenido. ¡Solo dime qué te gustaría construir!",
      fr: "Je peux vous aider à créer des flux de travail pour la recherche, la finance, la santé, le développement ou le contenu. Dites-moi simplement ce que vous aimeriez construire !"
    };
    
    return responses[language as keyof typeof responses] || responses.en;
  };

  const getErrorMessage = (language: string): string => {
    const responses = {
      en: "I'm sorry, I didn't understand that. Could you please try again?",
      sw: "Samahani, sikuielewa. Tafadhali jaribu tena?",
      es: "Lo siento, no entendí eso. ¿Podrías intentar de nuevo?",
      fr: "Je suis désolé, je n'ai pas compris. Pourriez-vous réessayer ?"
    };
    
    return responses[language as keyof typeof responses] || responses.en;
  };

  const generateGuidanceSteps = (workflowType: string): GuidanceStep[] => {
    const stepTemplates = {
      research_pipeline: [
        {
          id: '1',
          title: 'Create Source Collector Agent',
          description: 'Set up an agent to collect research sources from ArXiv, web, and databases',
          action: 'create_agent' as const,
          completed: false,
          instructions: [
            'Open the Agent Library in Studio',
            'Select "Source Collector" template',
            'Configure data sources (ArXiv, web URLs, databases)',
            'Set collection parameters (max results, timeouts)',
            'Test with sample queries'
          ]
        },
        {
          id: '2',
          title: 'Configure Research Synthesizer',
          description: 'Set up AI-powered synthesis with Mistral or OpenAI',
          action: 'configure' as const,
          completed: false,
          instructions: [
            'Add Research Synthesizer agent to workflow',
            'Configure LLM provider (Mistral/OpenAI)',
            'Set synthesis parameters (max tokens, temperature)',
            'Define focus areas (methodology, results, conclusions)',
            'Test synthesis with sample documents'
          ]
        },
        {
          id: '3',
          title: 'Add Quality Auditor',
          description: 'Implement quality checks for hallucinations and bias',
          action: 'create_agent' as const,
          completed: false,
          instructions: [
            'Add Quality Auditor agent',
            'Configure audit parameters (hallucination threshold, bias detection)',
            'Set up citation verification',
            'Define quality scoring criteria',
            'Test audit functionality'
          ]
        },
        {
          id: '4',
          title: 'Connect and Test Workflow',
          description: 'Wire up the agents and test the complete pipeline',
          action: 'connect' as const,
          completed: false,
          instructions: [
            'Connect Source Collector → Research Synthesizer',
            'Connect Research Synthesizer → Quality Auditor',
            'Configure data flow between agents',
            'Test with real research queries',
            'Monitor execution and performance'
          ]
        }
      ],
      finance_pipeline: [
        {
          id: '1',
          title: 'Set up Bank Connector',
          description: 'Connect to banking APIs for transaction data',
          action: 'create_agent' as const,
          completed: false,
          instructions: [
            'Configure Plaid or Open Banking connection',
            'Set up API credentials securely',
            'Define data collection parameters',
            'Test bank data retrieval',
            'Implement error handling'
          ]
        },
        {
          id: '2',
          title: 'Configure Risk Scorer',
          description: 'Set up ML model for credit risk assessment',
          action: 'configure' as const,
          completed: false,
          instructions: [
            'Add Risk Scorer agent with XGBoost model',
            'Configure feature extraction',
            'Set risk thresholds (low, medium, high)',
            'Enable explainable AI features',
            'Test with sample financial data'
          ]
        },
        {
          id: '3',
          title: 'Implement Fairness Auditor',
          description: 'Add bias detection and fairness monitoring',
          action: 'create_agent' as const,
          completed: false,
          instructions: [
            'Add Fairness Auditor agent',
            'Configure protected attributes (age, gender, ethnicity)',
            'Set fairness metrics (demographic parity, equalized odds)',
            'Implement bias detection algorithms',
            'Test fairness across different demographics'
          ]
        },
        {
          id: '4',
          title: 'Deploy Decision Orchestrator',
          description: 'Finalize the decision-making and routing system',
          action: 'deploy' as const,
          completed: false,
          instructions: [
            'Connect all agents in sequence',
            'Configure decision routing logic',
            'Set up approval workflows',
            'Implement audit logging',
            'Deploy and monitor in production'
          ]
        }
      ]
    };
    
    return stepTemplates[workflowType as keyof typeof stepTemplates] || [];
  };

  const handleWorkflowSelect = (workflow: WorkflowSuggestion) => {
    setWorkflowSuggestions([workflow]);
    onWorkflowGenerated?.(workflow);
    
    const guidance = generateGuidanceSteps(workflow.id);
    setGuidanceSteps(guidance);
    onGuidanceRequested?.(guidance);
  };

  const toggleGuidanceStep = (stepId: string) => {
    setGuidanceSteps(prev => 
      prev.map(step => 
        step.id === stepId 
          ? { ...step, completed: !step.completed }
          : step
      )
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Voice Assistant</h3>
            <p className="text-sm text-gray-500">AI-powered workflow creation</p>
          </div>
        </div>
        
        {/* Language Selector */}
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-gray-500" />
          <select
            value={selectedLanguage.code}
            onChange={(e) => {
              const lang = supportedLanguages.find(l => l.code === e.target.value);
              if (lang) setSelectedLanguage(lang);
            }}
            className="text-sm border border-gray-300 rounded-md px-2 py-1"
          >
            {supportedLanguages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.nativeName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Voice Controls */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          className={`p-4 rounded-full transition-all ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>
        
        <button
          onClick={() => speak(response)}
          disabled={!response || isSpeaking}
          className={`p-4 rounded-full transition-all ${
            isSpeaking 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-500 text-white hover:bg-gray-600'
          } ${!response ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSpeaking ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
      </div>

      {/* Status */}
      <div className="text-center">
        {isListening && (
          <p className="text-sm text-blue-600 flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Listening... Speak now
          </p>
        )}
        {isProcessing && (
          <p className="text-sm text-yellow-600 flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Processing your request...
          </p>
        )}
        {isSpeaking && (
          <p className="text-sm text-green-600 flex items-center justify-center">
            <Volume2 className="w-4 h-4 mr-2" />
            Speaking response...
          </p>
        )}
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">You said:</h4>
          <p className="text-gray-900">{transcript}</p>
        </div>
      )}

      {/* Response */}
      {response && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-700 mb-2">Assistant:</h4>
          <p className="text-blue-900">{response}</p>
        </div>
      )}

      {/* Workflow Suggestions */}
      {workflowSuggestions.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Suggested Workflow</h4>
          {workflowSuggestions.map(workflow => (
            <div key={workflow.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {workflow.icon}
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{workflow.name}</h5>
                  <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>Category: {workflow.category}</span>
                    <span>Time: {workflow.estimatedTime}</span>
                    <span className={`px-2 py-1 rounded ${
                      workflow.complexity === 'simple' ? 'bg-green-100 text-green-800' :
                      workflow.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {workflow.complexity}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Agents: {workflow.agents.join(', ')}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleWorkflowSelect(workflow)}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  Use This
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Guidance Steps */}
      {guidanceSteps.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Implementation Guide</h4>
          <div className="space-y-3">
            {guidanceSteps.map(step => (
              <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleGuidanceStep(step.id)}
                    className={`mt-1 p-1 rounded ${
                      step.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {step.completed ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  </button>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{step.title}</h5>
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-700 mb-2">Steps:</p>
                      <ol className="text-xs text-gray-600 space-y-1">
                        {step.instructions.map((instruction, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-gray-400">{index + 1}.</span>
                            <span>{instruction}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          {workflowTemplates.map(template => (
            <button
              key={template.id}
              onClick={() => handleWorkflowSelect(template)}
              className="flex items-center space-x-2 p-2 text-left border border-gray-200 rounded hover:bg-gray-50"
            >
              {template.icon}
              <span className="text-xs font-medium">{template.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conversation History */}
      {conversationHistory.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Conversation History</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {conversationHistory.slice(-5).map((message, index) => (
              <div key={index} className={`text-xs p-2 rounded ${
                message.type === 'user' 
                  ? 'bg-gray-100 text-gray-800 ml-4' 
                  : 'bg-blue-100 text-blue-800 mr-4'
              }`}>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    {message.type === 'user' ? 'You' : 'Assistant'}:
                  </span>
                  <span className="text-gray-500">
                    {supportedLanguages.find(l => l.code === message.language)?.flag}
                  </span>
                </div>
                <p className="mt-1">{message.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoicePanel;
