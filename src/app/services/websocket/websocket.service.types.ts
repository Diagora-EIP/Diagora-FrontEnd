// Client packets
export interface WebSocketClientPacket {
    'type': 'auth' | 'action' | 'close';
    'sent_at': string;
    // Auth
    'token'?: string;
    // Action
    'namespace'?: string;
    'action_type'?: 'subscribe' | 'unsubscribe';
    'topic'?: string;
    'parameters'?: any;
};

export interface WebSocketClientPacketAuth extends WebSocketClientPacket {
    'type': 'auth';
    'sent_at': string;
    'token': string;
};

export interface WebSocketClientPacketAction extends WebSocketClientPacket {
    'type': 'action';
    'sent_at': string;
    'namespace': string;
    'action_type': 'subscribe' | 'unsubscribe';
    'topic': string;
    'parameters'?: any;
};

export interface WebSocketClientPacketClose extends WebSocketClientPacket {
    'type': 'close';
    'sent_at': string;
};

// Server packets
export interface WebSocketServerPacket {
    'type': 'response' | 'event';
    'sent_at': string;
    // Response
    'status'?: number;
    'message'?: string | null;
    // Event
    'from_namespace'?: string;
    'from_topic'?: string;
    'data'?: any;
};

export interface WebSocketServerPacketResponse extends WebSocketServerPacket {
    'type': 'response';
    'sent_at': string;
    'status': number;
    'message': string | null;
};

export interface WebSocketServerPacketEvent extends WebSocketServerPacket {
    'type': 'event';
    'sent_at': string;
    'from_namespace': string;
    'from_topic': string;
    'data': any;
};
