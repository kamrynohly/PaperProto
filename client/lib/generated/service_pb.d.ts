import * as jspb from 'google-protobuf'



export class LaunchGameRoomRequest extends jspb.Message {
  getGamesessionid(): string;
  setGamesessionid(value: string): LaunchGameRoomRequest;

  getHostid(): string;
  setHostid(value: string): LaunchGameRoomRequest;

  getHostusername(): string;
  setHostusername(value: string): LaunchGameRoomRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LaunchGameRoomRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LaunchGameRoomRequest): LaunchGameRoomRequest.AsObject;
  static serializeBinaryToWriter(message: LaunchGameRoomRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LaunchGameRoomRequest;
  static deserializeBinaryFromReader(message: LaunchGameRoomRequest, reader: jspb.BinaryReader): LaunchGameRoomRequest;
}

export namespace LaunchGameRoomRequest {
  export type AsObject = {
    gamesessionid: string,
    hostid: string,
    hostusername: string,
  }
}

export class LaunchGameRoomResponse extends jspb.Message {
  getStatus(): LaunchGameRoomResponse.LaunchGameRoomStatus;
  setStatus(value: LaunchGameRoomResponse.LaunchGameRoomStatus): LaunchGameRoomResponse;

  getMessage(): string;
  setMessage(value: string): LaunchGameRoomResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LaunchGameRoomResponse.AsObject;
  static toObject(includeInstance: boolean, msg: LaunchGameRoomResponse): LaunchGameRoomResponse.AsObject;
  static serializeBinaryToWriter(message: LaunchGameRoomResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LaunchGameRoomResponse;
  static deserializeBinaryFromReader(message: LaunchGameRoomResponse, reader: jspb.BinaryReader): LaunchGameRoomResponse;
}

export namespace LaunchGameRoomResponse {
  export type AsObject = {
    status: LaunchGameRoomResponse.LaunchGameRoomStatus,
    message: string,
  }

  export enum LaunchGameRoomStatus { 
    SUCCESS = 0,
    FAILURE = 1,
  }
}

export class JoinGameRoomRequest extends jspb.Message {
  getGamesessionid(): string;
  setGamesessionid(value: string): JoinGameRoomRequest;

  getUserid(): string;
  setUserid(value: string): JoinGameRoomRequest;

  getUsername(): string;
  setUsername(value: string): JoinGameRoomRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JoinGameRoomRequest.AsObject;
  static toObject(includeInstance: boolean, msg: JoinGameRoomRequest): JoinGameRoomRequest.AsObject;
  static serializeBinaryToWriter(message: JoinGameRoomRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JoinGameRoomRequest;
  static deserializeBinaryFromReader(message: JoinGameRoomRequest, reader: jspb.BinaryReader): JoinGameRoomRequest;
}

export namespace JoinGameRoomRequest {
  export type AsObject = {
    gamesessionid: string,
    userid: string,
    username: string,
  }
}

export class JoinGameRoomResponse extends jspb.Message {
  getStatus(): JoinGameRoomResponse.JoinGameRoomStatus;
  setStatus(value: JoinGameRoomResponse.JoinGameRoomStatus): JoinGameRoomResponse;

  getMessage(): string;
  setMessage(value: string): JoinGameRoomResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JoinGameRoomResponse.AsObject;
  static toObject(includeInstance: boolean, msg: JoinGameRoomResponse): JoinGameRoomResponse.AsObject;
  static serializeBinaryToWriter(message: JoinGameRoomResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JoinGameRoomResponse;
  static deserializeBinaryFromReader(message: JoinGameRoomResponse, reader: jspb.BinaryReader): JoinGameRoomResponse;
}

export namespace JoinGameRoomResponse {
  export type AsObject = {
    status: JoinGameRoomResponse.JoinGameRoomStatus,
    message: string,
  }

  export enum JoinGameRoomStatus { 
    SUCCESS = 0,
    FAILURE = 1,
  }
}

export class GetPlayersRequest extends jspb.Message {
  getGamesessionid(): string;
  setGamesessionid(value: string): GetPlayersRequest;

  getUserid(): string;
  setUserid(value: string): GetPlayersRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPlayersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetPlayersRequest): GetPlayersRequest.AsObject;
  static serializeBinaryToWriter(message: GetPlayersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPlayersRequest;
  static deserializeBinaryFromReader(message: GetPlayersRequest, reader: jspb.BinaryReader): GetPlayersRequest;
}

export namespace GetPlayersRequest {
  export type AsObject = {
    gamesessionid: string,
    userid: string,
  }
}

export class GetPlayersResponse extends jspb.Message {
  getUsername(): string;
  setUsername(value: string): GetPlayersResponse;

  getUserid(): string;
  setUserid(value: string): GetPlayersResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPlayersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetPlayersResponse): GetPlayersResponse.AsObject;
  static serializeBinaryToWriter(message: GetPlayersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPlayersResponse;
  static deserializeBinaryFromReader(message: GetPlayersResponse, reader: jspb.BinaryReader): GetPlayersResponse;
}

export namespace GetPlayersResponse {
  export type AsObject = {
    username: string,
    userid: string,
  }
}

export class SubscribeToGameUpdatesRequest extends jspb.Message {
  getGamesessionid(): string;
  setGamesessionid(value: string): SubscribeToGameUpdatesRequest;

  getUserid(): string;
  setUserid(value: string): SubscribeToGameUpdatesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribeToGameUpdatesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribeToGameUpdatesRequest): SubscribeToGameUpdatesRequest.AsObject;
  static serializeBinaryToWriter(message: SubscribeToGameUpdatesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribeToGameUpdatesRequest;
  static deserializeBinaryFromReader(message: SubscribeToGameUpdatesRequest, reader: jspb.BinaryReader): SubscribeToGameUpdatesRequest;
}

export namespace SubscribeToGameUpdatesRequest {
  export type AsObject = {
    gamesessionid: string,
    userid: string,
  }
}

export class SubscribeToGameUpdatesResponse extends jspb.Message {
  getFromplayerid(): string;
  setFromplayerid(value: string): SubscribeToGameUpdatesResponse;

  getGamestate(): string;
  setGamestate(value: string): SubscribeToGameUpdatesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribeToGameUpdatesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribeToGameUpdatesResponse): SubscribeToGameUpdatesResponse.AsObject;
  static serializeBinaryToWriter(message: SubscribeToGameUpdatesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribeToGameUpdatesResponse;
  static deserializeBinaryFromReader(message: SubscribeToGameUpdatesResponse, reader: jspb.BinaryReader): SubscribeToGameUpdatesResponse;
}

export namespace SubscribeToGameUpdatesResponse {
  export type AsObject = {
    fromplayerid: string,
    gamestate: string,
  }
}

export class SendGameUpdateRequest extends jspb.Message {
  getFromplayerid(): string;
  setFromplayerid(value: string): SendGameUpdateRequest;

  getGamestate(): string;
  setGamestate(value: string): SendGameUpdateRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendGameUpdateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SendGameUpdateRequest): SendGameUpdateRequest.AsObject;
  static serializeBinaryToWriter(message: SendGameUpdateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendGameUpdateRequest;
  static deserializeBinaryFromReader(message: SendGameUpdateRequest, reader: jspb.BinaryReader): SendGameUpdateRequest;
}

export namespace SendGameUpdateRequest {
  export type AsObject = {
    fromplayerid: string,
    gamestate: string,
  }
}

export class SendGameUpdateResponse extends jspb.Message {
  getStatus(): SendGameUpdateResponse.SendGameUpdateStatus;
  setStatus(value: SendGameUpdateResponse.SendGameUpdateStatus): SendGameUpdateResponse;

  getMessage(): string;
  setMessage(value: string): SendGameUpdateResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendGameUpdateResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SendGameUpdateResponse): SendGameUpdateResponse.AsObject;
  static serializeBinaryToWriter(message: SendGameUpdateResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendGameUpdateResponse;
  static deserializeBinaryFromReader(message: SendGameUpdateResponse, reader: jspb.BinaryReader): SendGameUpdateResponse;
}

export namespace SendGameUpdateResponse {
  export type AsObject = {
    status: SendGameUpdateResponse.SendGameUpdateStatus,
    message: string,
  }

  export enum SendGameUpdateStatus { 
    SUCCESS = 0,
    FAILURE = 1,
  }
}

export class GameEndRequest extends jspb.Message {
  getGamesessionid(): string;
  setGamesessionid(value: string): GameEndRequest;

  getEndstate(): string;
  setEndstate(value: string): GameEndRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GameEndRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GameEndRequest): GameEndRequest.AsObject;
  static serializeBinaryToWriter(message: GameEndRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GameEndRequest;
  static deserializeBinaryFromReader(message: GameEndRequest, reader: jspb.BinaryReader): GameEndRequest;
}

export namespace GameEndRequest {
  export type AsObject = {
    gamesessionid: string,
    endstate: string,
  }
}

export class GameEndResponse extends jspb.Message {
  getStatus(): GameEndResponse.GameEndStatus;
  setStatus(value: GameEndResponse.GameEndStatus): GameEndResponse;

  getMessage(): string;
  setMessage(value: string): GameEndResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GameEndResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GameEndResponse): GameEndResponse.AsObject;
  static serializeBinaryToWriter(message: GameEndResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GameEndResponse;
  static deserializeBinaryFromReader(message: GameEndResponse, reader: jspb.BinaryReader): GameEndResponse;
}

export namespace GameEndResponse {
  export type AsObject = {
    status: GameEndResponse.GameEndStatus,
    message: string,
  }

  export enum GameEndStatus { 
    SUCCESS = 0,
    FAILURE = 1,
  }
}

export class HeartbeatRequest extends jspb.Message {
  getRequestorId(): string;
  setRequestorId(value: string): HeartbeatRequest;

  getServerId(): string;
  setServerId(value: string): HeartbeatRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HeartbeatRequest.AsObject;
  static toObject(includeInstance: boolean, msg: HeartbeatRequest): HeartbeatRequest.AsObject;
  static serializeBinaryToWriter(message: HeartbeatRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HeartbeatRequest;
  static deserializeBinaryFromReader(message: HeartbeatRequest, reader: jspb.BinaryReader): HeartbeatRequest;
}

export namespace HeartbeatRequest {
  export type AsObject = {
    requestorId: string,
    serverId: string,
  }
}

export class HeartbeatResponse extends jspb.Message {
  getResponderId(): string;
  setResponderId(value: string): HeartbeatResponse;

  getStatus(): string;
  setStatus(value: string): HeartbeatResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HeartbeatResponse.AsObject;
  static toObject(includeInstance: boolean, msg: HeartbeatResponse): HeartbeatResponse.AsObject;
  static serializeBinaryToWriter(message: HeartbeatResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HeartbeatResponse;
  static deserializeBinaryFromReader(message: HeartbeatResponse, reader: jspb.BinaryReader): HeartbeatResponse;
}

export namespace HeartbeatResponse {
  export type AsObject = {
    responderId: string,
    status: string,
  }
}

