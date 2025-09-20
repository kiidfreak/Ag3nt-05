"""
Base Agent class for Python agents
"""

import asyncio
import json
import logging
import time
import uuid
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any, Dict, List, Optional, Union
from dataclasses import dataclass, asdict
from enum import Enum

@dataclass
class AgentContext:
    """Agent execution context"""
    agent_id: str
    session_id: str
    user_id: Optional[str] = None
    metadata: Dict[str, Any] = None

    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}

@dataclass
class AgentEvent:
    """Agent event"""
    type: str
    data: Any
    timestamp: datetime
    correlation_id: Optional[str] = None

@dataclass
class AgentHealth:
    """Agent health status"""
    status: str  # 'healthy', 'degraded', 'unhealthy'
    details: Dict[str, Any]
    metrics: Dict[str, float]

    def __post_init__(self):
        if self.details is None:
            self.details = {}
        if self.metrics is None:
            self.metrics = {}

class LogLevel(Enum):
    DEBUG = "debug"
    INFO = "info"
    WARN = "warn"
    ERROR = "error"

class BaseAgent(ABC):
    """Base class for all agents"""
    
    def __init__(self, manifest: Dict[str, Any]):
        self.manifest = manifest
        self.context: Optional[AgentContext] = None
        self.config: Dict[str, Any] = {}
        self.is_running = False
        self.health_status = AgentHealth(
            status="healthy",
            details={},
            metrics={}
        )
        self.logger = logging.getLogger(f"agent.{manifest.get('id', 'unknown')}")
        self._event_handlers = {}
        
        # Validate manifest
        self._validate_manifest()
    
    def _validate_manifest(self):
        """Validate agent manifest"""
        required_fields = ['id', 'name', 'version', 'description', 'runtime', 'inputs', 'outputs', 'metadata']
        
        for field in required_fields:
            if field not in self.manifest:
                raise ValueError(f"Missing required field in manifest: {field}")
        
        # Validate metadata
        metadata = self.manifest.get('metadata', {})
        required_metadata = ['author', 'tags', 'category']
        
        for field in required_metadata:
            if field not in metadata:
                raise ValueError(f"Missing required metadata field: {field}")
    
    async def initialize(self, context: AgentContext, config: Dict[str, Any] = None):
        """Initialize the agent"""
        if config is None:
            config = {}
            
        self.context = context
        self.config = {**self.manifest.get('config', {}), **config}
        self.is_running = True
        
        await self.on_initialize()
        self._emit_event('agent:initialized', {'agent_id': self.manifest['id'], 'context': asdict(context)})
    
    async def shutdown(self):
        """Shutdown the agent"""
        self.is_running = False
        await self.on_shutdown()
        self._emit_event('agent:shutdown', {'agent_id': self.manifest['id']})
    
    async def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a task"""
        if not self.is_running:
            raise RuntimeError("Agent is not running")
        
        task_id = str(uuid.uuid4())
        start_time = time.time()
        
        try:
            self._emit_event('task:started', {'task_id': task_id, 'input': input_data, 'agent_id': self.manifest['id']})
            
            # Validate input
            self._validate_input(input_data)
            
            # Execute the task
            result = await self.on_execute(input_data)
            
            # Validate output
            self._validate_output(result)
            
            execution_time = (time.time() - start_time) * 1000  # Convert to milliseconds
            self._emit_event('task:completed', {
                'task_id': task_id,
                'result': result,
                'execution_time': execution_time,
                'agent_id': self.manifest['id']
            })
            
            return result
            
        except Exception as error:
            execution_time = (time.time() - start_time) * 1000
            self._emit_event('task:failed', {
                'task_id': task_id,
                'error': str(error),
                'execution_time': execution_time,
                'agent_id': self.manifest['id']
            })
            raise
    
    def get_health(self) -> AgentHealth:
        """Get agent health status"""
        return self.health_status
    
    def update_health(self, status: str = None, details: Dict[str, Any] = None, metrics: Dict[str, float] = None):
        """Update health status"""
        if status is not None:
            self.health_status.status = status
        if details is not None:
            self.health_status.details.update(details)
        if metrics is not None:
            self.health_status.metrics.update(metrics)
        
        self._emit_event('health:updated', asdict(self.health_status))
    
    def publish_event(self, event_type: str, data: Any, correlation_id: str = None):
        """Publish an event"""
        event = AgentEvent(
            type=event_type,
            data=data,
            timestamp=datetime.now(),
            correlation_id=correlation_id
        )
        self._emit_event('event:published', asdict(event))
    
    def log(self, level: LogLevel, message: str, data: Dict[str, Any] = None):
        """Log a message"""
        if data is None:
            data = {}
        
        log_entry = {
            'level': level.value,
            'message': message,
            'data': data,
            'timestamp': datetime.now().isoformat(),
            'agent_id': self.manifest['id'],
            'session_id': self.context.session_id if self.context else None
        }
        
        # Use Python logging
        if level == LogLevel.DEBUG:
            self.logger.debug(message, extra=data)
        elif level == LogLevel.INFO:
            self.logger.info(message, extra=data)
        elif level == LogLevel.WARN:
            self.logger.warning(message, extra=data)
        elif level == LogLevel.ERROR:
            self.logger.error(message, extra=data)
        
        self._emit_event('log', log_entry)
    
    def get_manifest(self) -> Dict[str, Any]:
        """Get agent manifest"""
        return self.manifest
    
    def get_context(self) -> Optional[AgentContext]:
        """Get agent context"""
        return self.context
    
    def get_config(self) -> Dict[str, Any]:
        """Get agent configuration"""
        return self.config
    
    def on_event(self, event_type: str, handler):
        """Register event handler"""
        if event_type not in self._event_handlers:
            self._event_handlers[event_type] = []
        self._event_handlers[event_type].append(handler)
    
    def _emit_event(self, event_type: str, data: Any):
        """Emit an event to registered handlers"""
        if event_type in self._event_handlers:
            for handler in self._event_handlers[event_type]:
                try:
                    handler(data)
                except Exception as e:
                    self.log(LogLevel.ERROR, f"Error in event handler for {event_type}: {e}")
    
    def _validate_input(self, input_data: Dict[str, Any]):
        """Validate input against manifest schema"""
        inputs_schema = self.manifest.get('inputs', {})
        
        for key, schema in inputs_schema.items():
            if schema.get('required', False) and key not in input_data:
                raise ValueError(f"Required input '{key}' is missing")
            
            if key in input_data:
                self._validate_value(input_data[key], schema, key)
    
    def _validate_output(self, output_data: Dict[str, Any]):
        """Validate output against manifest schema"""
        outputs_schema = self.manifest.get('outputs', {})
        
        for key, schema in outputs_schema.items():
            if key not in output_data:
                raise ValueError(f"Required output '{key}' is missing")
            
            self._validate_value(output_data[key], schema, key)
    
    def _validate_value(self, value: Any, schema: Dict[str, Any], path: str):
        """Validate a value against a schema"""
        expected_type = schema.get('type')
        
        if expected_type == 'array' and not isinstance(value, list):
            raise ValueError(f"Expected array for '{path}', got {type(value).__name__}")
        
        if expected_type == 'object' and not isinstance(value, dict):
            raise ValueError(f"Expected object for '{path}', got {type(value).__name__}")
        
        if expected_type in ['string', 'text'] and not isinstance(value, str):
            raise ValueError(f"Expected string for '{path}', got {type(value).__name__}")
        
        if expected_type == 'number' and not isinstance(value, (int, float)):
            raise ValueError(f"Expected number for '{path}', got {type(value).__name__}")
        
        if expected_type == 'boolean' and not isinstance(value, bool):
            raise ValueError(f"Expected boolean for '{path}', got {type(value).__name__}")
        
        # Validate constraints
        constraints = schema.get('constraints', {})
        if constraints:
            self._validate_constraints(value, constraints, path)
    
    def _validate_constraints(self, value: Any, constraints: Dict[str, Any], path: str):
        """Validate constraints"""
        if 'min' in constraints and value < constraints['min']:
            raise ValueError(f"Value for '{path}' must be >= {constraints['min']}")
        
        if 'max' in constraints and value > constraints['max']:
            raise ValueError(f"Value for '{path}' must be <= {constraints['max']}")
        
        if 'minLength' in constraints and len(str(value)) < constraints['minLength']:
            raise ValueError(f"Value for '{path}' must have length >= {constraints['minLength']}")
        
        if 'maxLength' in constraints and len(str(value)) > constraints['maxLength']:
            raise ValueError(f"Value for '{path}' must have length <= {constraints['maxLength']}")
        
        if 'pattern' in constraints:
            import re
            if not re.match(constraints['pattern'], str(value)):
                raise ValueError(f"Value for '{path}' does not match pattern {constraints['pattern']}")
        
        if 'enum' in constraints and value not in constraints['enum']:
            raise ValueError(f"Value for '{path}' must be one of: {constraints['enum']}")
    
    # Abstract methods to be implemented by concrete agents
    @abstractmethod
    async def on_initialize(self):
        """Called when agent is initialized"""
        pass
    
    @abstractmethod
    async def on_shutdown(self):
        """Called when agent is shutdown"""
        pass
    
    @abstractmethod
    async def on_execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the main agent logic"""
        pass
