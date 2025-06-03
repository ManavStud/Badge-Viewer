import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button";
import { Check,RotateCcw } from 'lucide-react';

const BadgeAssignmentDropdown = ({ user, updateUserDetails }) => {
  const [badges, setBadges] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [setUsers] = useState(false);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = `${process.env.SERVER_URL}/badges`;
      const userBadges = user?.badges.map(b => Number(b.badgeId));
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      if (response) {
        const revokableBadges = response.data.badges.filter((badge) =>
          userBadges.includes(badge.id)
        );
        setBadges(revokableBadges);
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBadges();
  }, [user]);

  const handleRevoke = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `${process.env.SERVER_URL}/revoke-badge`;
      const response = await axios.post(
        url,
        {
          email: user.email,
          badgeId: selectedBadge
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      updateUserDetails(user.email, response.data.user);
      toast.success("Badge revoked successfully!");
      // toast.success(
      //   <div>
      //     Badge revoked from <strong style={{ color: '#00CBF0' }}>{response.data.user.firstName}</strong>!
      //   </div>
      // );
      setSelectedBadge(null); // Reset selection after revocation
      await fetchBadges(); // refresh dropdown
    } catch (error) {
      console.error("Error revoking badge:", error);
    }
  };

  return (
    <div className="p-4 max-w-md">
      <label className="text-sm font-medium text-gray-300 mb-1">Revoke Badge</label>
      <div className='flex flex-row items-center space-x-2'>
        <select
          className="w-full p-2 rounded bg-[#1A1B2E]/60 text-gray-400 border-gray-600 focus:border-cyan-500 focus:ring-cyan-500"
          value={selectedBadge || ""}
          onChange={(e) => setSelectedBadge(Number(e.target.value))}
          disabled={loading}
        >
          <option value="">{loading ? "Loading badges..." : "Select a badge"}</option>
          {!loading &&
            badges.map((badge) => (
              <option key={badge.id} value={badge.id}>
                {badge.name}
              </option>
            ))}
        </select>
        <Button
          className="text-sm bg-gray-700 text-white hover:bg-gray-600"
          onClick={() => setSelectedBadge(null)}
        >
          <RotateCcw />
        </Button>
        <Button
          className={`text-sm ${selectedBadge ? 'text-red-500' : 'text-gray-400'} bg-gray-800 hover:bg-red-700 hover:text-white`}
          onClick={handleRevoke}
          disabled={!selectedBadge}
        >
          <Check />
        </Button>
      </div>
      {badges.length === 0 && (
        <p className="text-sm mt-2 text-gray-300">This user has no badges assigned to them.</p>
      )}
    </div>
  );
};

export default BadgeAssignmentDropdown;
