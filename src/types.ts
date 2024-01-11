import { type Unsubscribe } from "firebase/database";

export type DiscussionViewHandler = (city: string, group: string) => void;

export interface MarkerInfos {
  marker: L.Marker;
  city: string;
  nameList: string[];
}

export interface Config {
  UriInfos: {
    base: string;
    prefix: string;
    extention: string;
    suffix: string;
  };
  categories: Record<string, { color: string }>;
}

export type DatabaseFuncionOpenDiscussion = (
  city: string,
  group: string,
  callback: (error: Error | null, discussionText: string) => void
) => Unsubscribe;

export type DatabaseFuncionStoreDiscussion = (
  city: string,
  group: string,
  text: string
) => void;

export type DatabaseFunctionAddUser = (
  name: string,
  city: string,
  group: string
) => void;

export type MapFunctionChangeGroup = (group: string) => void;

export type MapFunctionAddUser = (
  x: number,
  y: number,
  group: string,
  city: string,
  name: string
) => void;
