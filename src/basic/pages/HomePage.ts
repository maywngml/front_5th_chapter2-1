import { Cart } from '@/basic/components';

export default function HomePage() {
  const render = () => {
    const app = document.getElementById('app') as HTMLDivElement;
    const container = document.createElement('div');
    container.id = 'container';

    container.appendChild(Cart());
    app.appendChild(container);
  };

  render();
}
