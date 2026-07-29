import Sidebar from "./Sidebar";

function AppLayout({ children }) {
  return (
    <div className="app-shell d-flex min-vh-100">
      <aside className="app-sidebar d-flex flex-column p-4">
        <Sidebar />
      </aside>
      <main className="flex-grow-1 p-4 bg-surface">
        {children}
      </main>
    </div>
  );
}

export default AppLayout;