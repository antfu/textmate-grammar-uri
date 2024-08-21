import fs from 'node:fs/promises'
import type { LanguageRegistration } from 'shiki'

const names = {
  schema: 'constant.language.uri.scheme',
  separator: 'punctuation.separator.uri',
  hostname: 'entity.name.uri.hostname',
  port: 'number.uri.port',
  extension: 'type.identifier.uri.extension',
  query: 'entity.name.uri.query.key',
  queryKey: 'entity.name.uri.query.key',
  queryValue: 'string.value.uri.query.value',
  data: 'comment.uri.data',
  fragment: 'comment.uri.fragment',
  encoded: 'constant.character.uri.encoded',
}

export const grammarUri: LanguageRegistration = {
  name: 'uri',
  patterns: [
    { include: '#root' },
  ],
  repository: {
    '$base': undefined!,
    '$self': undefined!,
    'root': {
      patterns: [
        { include: '#start' },
      ],
      end: '\n',
    },
    'start': {
      patterns: [
        { include: '#datauri' },
        { include: '#mailto' },
        { include: '#windows-driver' },
        { include: '#double-slash' },
        { include: '#scheme' },
        { include: '#relative-path' },
        { include: '#path' },
      ],
    },
    'path': {
      patterns: [
        { include: '#encoded-char' },
        { include: '#separator' },
        { include: '#extension' },
        { include: '#query' },
        { include: '#fragment' },
      ],
    },
    'windows-driver': {
      match: '(^[a-zA-Z])(:\\\\)',
      captures: {
        1: { name: names.schema },
        2: { name: names.separator },
      },
    },
    'scheme': {
      match: '(^[a-zA-Z][a-zA-Z0-9+.-]*)(:[/\\\\]*)([^/\\\\]*)',
      captures: {
        1: { name: names.schema },
        2: { name: names.separator },
        3: {
          patterns: [
            { include: '#host-user' },
            { include: '#hostname' },
            { include: '#port' },
          ],
        },
      },
    },
    'double-slash': {
      match: '^(:?//)([^/\\\\]*)',
      captures: {
        1: { name: names.separator },
        2: {
          patterns: [
            { include: '#host-user' },
            { include: '#hostname' },
            { include: '#port' },
          ],
        },
      },
    },
    'relative-path': {
      match: '^([\.~#]+)',
      captures: {
        1: { name: names.schema },
      },
    },
    'mailto': {
      match: '^(mailto)(:)([^@]*)(@)?(.*)$',
      captures: {
        1: { name: names.schema },
        2: { name: names.separator },
        3: { },
        4: { name: 'keyword.operator.uri.at' },
        5: { name: names.hostname },
      },
    },
    'host-user': {
      match: '([^:@]+)(:)([^:@]+)(@)',
      captures: {
        1: { name: 'property.user.uri' },
        2: { name: names.separator },
        3: { name: 'identifier.password.uri' },
        4: { name: 'keyword.operator.uri.at' },
      },
    },
    'hostname': {
      match: '([^:]+)',
      name: names.hostname,
    },
    'port': {
      match: '(:)([0-9]+)',
      captures: {
        1: { name: names.separator },
        2: { name: names.port },
      },
    },
    'separator': {
      match: '[/\\\\]',
      name: names.separator,
    },
    'encoded-char': {
      match: '(%)([0-9a-fA-F]{2})',
      captures: {
        1: { name: 'punctuation.definition.string.begin.uri' },
        2: { name: names.encoded },
      },
    },
    'extension': {
      match: '(\\.[a-zA-Z0-9]+)$',
      name: names.extension,
    },
    'datauri': {
      match: '(^data)(:)([\\w/]+)([;,])(.*)$',
      captures: {
        1: { name: names.schema },
        2: { name: names.separator },
        3: { name: 'keyword.operator.uri.mime' },
        4: { name: names.separator },
        5: {
          patterns: [
            { include: '#base64' },
            { include: '#path' },
          ],
        },
      },
    },
    'base64': {
      match: '(base64)(,)([A-Za-z0-9+/=]+)$',
      captures: {
        1: { name: names.schema },
        2: { name: names.separator },
        3: { name: names.data },
      },
    },
    'query': {
      match: '([?&])([^=]+)(=)([^&#]+)',
      captures: {
        1: { name: 'keyword.operator.uri.query' },
        2: { name: names.queryKey },
        3: { name: names.separator },
        4: { name: names.queryValue },
      },
    },
    'fragment': {
      match: '(#)(.*)$',
      captures: {
        1: { name: names.separator },
        2: { name: names.fragment },
      },
    },
  },
  scopeName: 'text.uri',
}

await fs.mkdir('./grammars', { recursive: true })
await fs.writeFile('./grammars/uri.json', JSON.stringify(grammarUri, null, 2), 'utf-8')
