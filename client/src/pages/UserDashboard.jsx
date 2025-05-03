export default function UserDashboard() {
    return (
      <div className="p-5 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
        <p className="text-gray-700">
          Welcome to your dashboard! You can view your activity, update your profile, and explore more features from here.
        </p>
  
        {/* Example sections */}
        <div className="mt-6 space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Your Profile</h2>
            <p>Edit your information and settings.</p>
          </div>
  
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
            <p>Check out your recent logins, updates, and more.</p>
          </div>
        </div>
      </div>
    );
  }
  