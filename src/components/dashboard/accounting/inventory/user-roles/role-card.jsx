import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export default function RoleCard({
  role = {
    id: 1,
    name: 'Admin',
    description: 'Full access including settings and report',
    userCount: 1,
    permissions: [
      'Full System Access',
      'User Management',
      'Settings Management',
      'System Configuration',
      'All Reports',
    ],
  },
  selected = false,
  onSelect,
  onEditPermission,
}) {
  return (
    <Card className="w-full max-w-sm">
      <CardContent className="space-y-4 px-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Checkbox
              className="mt-1 size-4"
              checked={selected}
              onCheckedChange={(checked) => onSelect?.(role.id, checked)}
            />

            <div className="flex-1">
              <h3 className="text-base font-semibold">{role.name}</h3>
              <p className="text-sm text-gray-500">{role.description}</p>
            </div>
          </div>

          <Badge
            variant="secondary"
            className="rounded-full bg-[#254C00]/10 px-3 py-1 text-xs font-medium text-[#254C00]"
          >
            {role.userCount} user{role.userCount !== 1 ? 's' : ''}
          </Badge>
        </div>

        {/* Permissions Section */}
        <div className="mt-4 space-y-3">
          <h4 className="text-sm font-medium text-[#434343]">Permissions:</h4>

          <div className="space-y-3">
            {role.permissions.map((permission, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Check className="h-4 w-4 shrink-0 text-[#254C00]" />
                <span className="text-sm text-gray-600">{permission}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Button
            className="h-10 w-full rounded-2xl text-sm"
            onClick={() => onEditPermission?.(role)}
          >
            Edit Permission
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
