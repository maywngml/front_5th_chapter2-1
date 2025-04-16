const eventTypes: string[] = [];
const elementMap = new Map();

const handleEvent = (e: Event) => {
  const targetMap = elementMap.get(e.target);
  const handler = targetMap?.get(e.type);
  if (handler) {
    handler.call(e.target, e);
  }
};

export function setupEventListeners(root: HTMLElement) {
  eventTypes.forEach((eventType) => {
    root.addEventListener(eventType, handleEvent);
  });
}

export function addEvent(
  element: HTMLElement,
  eventType: string,
  handler: EventListener,
) {
  if (!eventTypes.includes(eventType)) {
    eventTypes.push(eventType);
  }
  const targetMap = elementMap.get(element) || new Map();
  if (targetMap.get(eventType) === handler) return;
  targetMap.set(eventType, handler);
  elementMap.set(element, targetMap);
}
