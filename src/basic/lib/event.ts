type EventHandlerMap = Map<string, Map<HTMLElement, (e: Event) => void>>;

const eventHandlers: EventHandlerMap = new Map();

const handleEvent = (e: Event) => {
  const handlers = eventHandlers.get(e.type);
  if (!handlers) return;

  for (const [selector, handler] of handlers) {
    const target = e.target as Element;
    if (selector.contains(target)) {
      handler(e);
      break;
    }
  }
};

export function setupEventListeners(root: HTMLElement) {
  for (const [eventType] of eventHandlers) {
    root.addEventListener(eventType, handleEvent);
  }
}

export function addEvent(
  element: HTMLElement,
  eventType: string,
  handler: EventListener,
) {
  if (!eventHandlers.has(eventType)) {
    eventHandlers.set(eventType, new Map());
  }

  const handlerType = eventHandlers.get(eventType);
  if (handlerType) {
    handlerType.set(element, handler);
  }
}
