import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="h-[100dvh] bg-[var(--color-panel-bg)] overflow-hidden">
      <Outlet />
    </div>
  );
}
