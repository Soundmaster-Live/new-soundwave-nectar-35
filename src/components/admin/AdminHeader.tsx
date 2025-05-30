import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminHeader = () => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-3xl">Admin Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          Welcome to your admin dashboard. Here you can manage your website's content,
          users, and settings.
        </p>
      </CardContent>
    </Card>
  );
};

export default AdminHeader;