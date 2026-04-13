declare module "#continuum/engine.js" {
  import Currency from "#continuum/currency.js"
  import { ProducerOptions } from "#continuum/producer.js"

  export default class ContinuumEngine {
    readonly currencies: Record<string, Currency>

    createCurrency (type: string, initialValue: number): Currency

    createProducer (opts: ProducerOptions): Producer

    currency (type: string): Currency | undefined

    onTick (dt: Date): void
  }
}
declare module "#continuum/eventemitter.js" {
  export interface Listener {
    (...args: any[]): void
  }

  export interface Subscription {
    // function to remove the listener
    (): void
  }

  export default class EventEmitter {
    on (event: string, listener: Listener): Subscription

    off (event: string): void

    removeListener (event: string, listener: Listener): void

    emit (event: string, ...args: any[]): void

    once (event: string, listener: Listener): void
  }
}

declare module "#continuum/entity.js" {
  import EventEmitter from "#continuum/eventemitter.js"

  export interface EntityOptions {
    key: string,
    count?: number
    maxCount?: number
  }

  export interface EntityState {
    type: string
    key: string
    count: number
    maxCount: number
  }

  export default class Entity extends EventEmitter {
    readonly type: string
    readonly key: string
    readonly count: number
    readonly maxCount: number

    constructor (type: string, opts: EntityOptions)

    serialize (): EntityState

    deserialise (state: EntityState): void

    incrementBy (value: number): number

    requirementMet (): boolean

    onTick (dt: Date): void

    processTick (dt: Date): void

    canProcess (dt: Date): boolean
  }
}

declare module "#continuum/currency.js" {
  import EventEmitter, { Subscription } from "#continuum/eventemitter.js"

  export interface CurrencyState {
    type: string
    value: number
  }

  export interface CurrencyUpdatedEvent {
    obj: Currency
    type: string
    value: number
    delta: number
  }

  export default class Currency extends EventEmitter {
    readonly type: string
    value: number

    createCurrency (type: string, initialValue: number): Currency

    serialize (): CurrencyState

    deserialise (state: CurrencyState): void

    incrementBy (value: number): void

    on (event: "CURRENCY_UPDATED", listener: (e: CurrencyUpdatedEvent) => void): Subscription
  }
}

declare module "#continuum/producer.js" {
  import Entity from "#continuum/entity.js"

  export interface ProducerOptions {
    baseCost: number
    costCoefficient?: number
    processingEnabled?: boolean
    inputs?: object
    outputs?: {
      resources: object
      producers: object
    }
    postProcessors?: (() => void)[]
  }

  export interface ProducerOutputEvent {
    producer: Producer
    output: object
    delta: number
  }

  export default class Producer extends Entity {
    readonly baseCost: number
    readonly costCoefficient: number
    readonly consumedInputs: object
    processingEnabled: boolean

    constructor (opts: ProducerOptions)

    resetTimers (): void

    calculateCost (count: number): number

    addOutput (
      outputType: string,
      outputKey: string,
      productionTime: number,
      productionAmount: number,
    ): this

    getOutput (outputType: string, outputKey: string): Entity | undefined

    processTick (dt: Date): void

    on (event: "PRODUCER_OUTPUT", listener: (e: ProducerOutputEvent) => void): void
  }
}