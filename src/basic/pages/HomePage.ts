import { Cart } from '@/basic/components';
import { setupEventListeners } from '../lib/event';

export default function HomePage() {
  const render = () => {
    const app = document.getElementById('app') as HTMLDivElement;
    const container = document.createElement('div');
    container.id = 'container';

    container.appendChild(Cart());
    app.appendChild(container);
    setupEventListeners(app);
  };

  render();
}
