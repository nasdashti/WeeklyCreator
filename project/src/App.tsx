import { Toaster } from 'react-hot-toast';
import { AddChannelForm } from './components/AddChannelForm';
import { ChannelList } from './components/ChannelList';
import { AuthProvider } from './features/auth/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AddChannelForm />
          <div className="mt-8">
            <ChannelList />
          </div>
        </div>
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
}

export default App;