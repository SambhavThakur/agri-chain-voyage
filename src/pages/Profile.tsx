import { useState } from 'react';
import { User, Mail, Shield, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data - in real app, would come from backend
  const [profileData, setProfileData] = useState({
    name: user?.role === 'farmer' ? 'John Smith' :
          user?.role === 'transporter' ? 'Mike Johnson' :
          user?.role === 'retailer' ? 'Sarah Wilson' : 'Alex Chen',
    email: user?.email || '',
    phone: '+91 98765 43210',
    address: user?.role === 'farmer' ? 'Green Valley Farm, Village Khedli, Tehsil Narnaul, Haryana 123401' :
             user?.role === 'transporter' ? 'Transport Hub, Sector 15, Gurgaon, Haryana 122001' :
             user?.role === 'retailer' ? 'Fresh Market Store, Connaught Place, New Delhi 110001' :
             'Residential Area, Sector 12, Noida, Uttar Pradesh 201301',
    bio: user?.role === 'farmer' ? 'Sustainable farming enthusiast with 15 years of experience in organic agriculture.' :
         user?.role === 'transporter' ? 'Reliable logistics provider specializing in temperature-controlled fresh produce delivery.' :
         user?.role === 'retailer' ? 'Committed to bringing fresh, locally-sourced products to our community.' :
         'Conscious consumer passionate about sustainable and traceable food sourcing.',
    company: user?.role === 'farmer' ? 'Green Valley Organic Farm' :
             user?.role === 'transporter' ? 'Swift Transport Solutions' :
             user?.role === 'retailer' ? 'Fresh Market Store' :
             '',
    certifications: user?.role === 'farmer' ? ['USDA Organic', 'Sustainable Agriculture', 'Fair Trade'] :
                     user?.role === 'transporter' ? ['DOT Certified', 'Cold Chain Specialist', 'ISO 9001'] :
                     user?.role === 'retailer' ? ['Food Safety Certified', 'Organic Retailer License'] :
                     ['Conscious Consumer Certified'],
    // Currency fields in rupees
    income: user?.role === 'farmer' ? '₹ 5,00,000' :
            user?.role === 'transporter' ? '₹ 8,00,000' :
            user?.role === 'retailer' ? '₹ 12,00,000' : '',
    pricing: user?.role === 'farmer' ? '₹ 50/kg' :
             user?.role === 'transporter' ? '₹ 15/km' :
             user?.role === 'retailer' ? '₹ 80/kg' : '',
    bankAccount: '1234567890',
    ifscCode: 'SBIN0001234',
  });

  const [editData, setEditData] = useState(profileData);

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const getRoleDisplayName = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'farmer': return 'text-success';
      case 'transporter': return 'text-warning';
      case 'retailer': return 'text-primary';
      case 'consumer': return 'text-accent-foreground';
      default: return 'text-foreground';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'farmer': return 'bg-success/10 text-success border-success/20';
      case 'transporter': return 'bg-warning/10 text-warning border-warning/20';
      case 'retailer': return 'bg-primary/10 text-primary border-primary/20';
      case 'consumer': return 'bg-accent text-accent-foreground border-accent/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Card */}
      <Card className="rounded-2xl border-0 shadow-medium">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Your personal and professional details
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  variant="agricultural"
                  size="sm"
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Role Badge */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
              <User className="h-8 w-8" />
            </div>
            <div>
              <div className="text-2xl font-bold">{profileData.name}</div>
              <span className={`inline-flex items-center px-3 py-1 rounded-xl border text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
                {getRoleDisplayName(user.role)}
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="rounded-xl"
                />
              ) : (
                <div className="p-3 bg-muted rounded-xl">{profileData.name}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="rounded-xl"
                />
              ) : (
                <div className="p-3 bg-muted rounded-xl">{profileData.email}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  className="rounded-xl"
                />
              ) : (
                <div className="p-3 bg-muted rounded-xl">{profileData.phone}</div>
              )}
            </div>

            {profileData.company && (
              <div className="space-y-2">
                <Label htmlFor="company">Company/Organization</Label>
                {isEditing ? (
                  <Input
                    id="company"
                    value={editData.company}
                    onChange={(e) => setEditData({...editData, company: e.target.value})}
                    className="rounded-xl"
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-xl">{profileData.company}</div>
                )}
              </div>
            )}

            {/* Financial Information */}
            {user?.role !== 'consumer' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="income">
                    {user?.role === 'farmer' ? 'Annual Income' : 
                     user?.role === 'transporter' ? 'Annual Revenue' : 'Annual Turnover'}
                  </Label>
                  {isEditing ? (
                    <Input
                      id="income"
                      value={editData.income}
                      onChange={(e) => setEditData({...editData, income: e.target.value})}
                      className="rounded-xl"
                      placeholder="₹ 0"
                    />
                  ) : (
                    <div className="p-3 bg-muted rounded-xl">{profileData.income}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricing">
                    {user?.role === 'farmer' ? 'Rate per kg' : 
                     user?.role === 'transporter' ? 'Rate per km' : 'Average Price per kg'}
                  </Label>
                  {isEditing ? (
                    <Input
                      id="pricing"
                      value={editData.pricing}
                      onChange={(e) => setEditData({...editData, pricing: e.target.value})}
                      className="rounded-xl"
                      placeholder="₹ 0"
                    />
                  ) : (
                    <div className="p-3 bg-muted rounded-xl">{profileData.pricing}</div>
                  )}
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="bankAccount">Bank Account Number</Label>
              {isEditing ? (
                <Input
                  id="bankAccount"
                  value={editData.bankAccount}
                  onChange={(e) => setEditData({...editData, bankAccount: e.target.value})}
                  className="rounded-xl"
                />
              ) : (
                <div className="p-3 bg-muted rounded-xl">{profileData.bankAccount}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ifscCode">IFSC Code</Label>
              {isEditing ? (
                <Input
                  id="ifscCode"
                  value={editData.ifscCode}
                  onChange={(e) => setEditData({...editData, ifscCode: e.target.value})}
                  className="rounded-xl"
                />
              ) : (
                <div className="p-3 bg-muted rounded-xl">{profileData.ifscCode}</div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            {isEditing ? (
              <Textarea
                id="address"
                value={editData.address}
                onChange={(e) => setEditData({...editData, address: e.target.value})}
                className="rounded-xl"
                rows={2}
              />
            ) : (
              <div className="p-3 bg-muted rounded-xl">{profileData.address}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={editData.bio}
                onChange={(e) => setEditData({...editData, bio: e.target.value})}
                className="rounded-xl"
                rows={3}
              />
            ) : (
              <div className="p-3 bg-muted rounded-xl">{profileData.bio}</div>
            )}
          </div>

          {/* Certifications */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Certifications
            </Label>
            <div className="flex flex-wrap gap-2">
              {profileData.certifications.map((cert, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-xl bg-accent text-accent-foreground text-sm border border-accent/20"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card className="rounded-2xl border-0 shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Preferences
          </CardTitle>
          <CardDescription>
            Manage your account security and application preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-card rounded-xl border">
            <div>
              <div className="font-medium">Password</div>
              <div className="text-sm text-muted-foreground">
                Last changed 30 days ago
              </div>
            </div>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-card rounded-xl border">
            <div>
              <div className="font-medium">Two-Factor Authentication</div>
              <div className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </div>
            </div>
            <Button variant="outline" size="sm">
              Enable 2FA
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-card rounded-xl border">
            <div>
              <div className="font-medium">Blockchain Wallet</div>
              <div className="text-sm text-muted-foreground">
                Connect your wallet for blockchain transactions
              </div>
            </div>
            <Button variant="outline" size="sm">
              Connect Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}