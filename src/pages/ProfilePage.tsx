import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const userProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  joinDate: "2024-01-01",
  role: "Project Manager",
  bio: "Experienced project manager with 5+ years in software development. Passionate about delivering high-quality solutions and leading cross-functional teams.",
  avatar: "JD",
  skills: ["Project Management", "Agile", "Scrum", "Team Leadership", "Client Relations"],
  socialLinks: {
    linkedin: "https://linkedin.com/in/johndoe",
    twitter: "https://twitter.com/johndoe",
    github: "https://github.com/johndoe"
  }
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(userProfile);
  const [editedProfile, setEditedProfile] = useState(userProfile);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillAdd = (skill: string) => {
    if (skill && !editedProfile.skills.includes(skill)) {
      setEditedProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setEditedProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-semibold text-text-primary">Autopilot Studio</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost">Profile</Button>
              <Button variant="outline">Settings</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-2xl">{profile.avatar}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-text-primary">{profile.name}</h1>
                    <p className="text-lg text-text-secondary">{profile.role}</p>
                    <p className="text-sm text-text-secondary mt-2">{profile.bio}</p>
                  </div>
                  <Button
                    onClick={isEditing ? handleSave : handleEdit}
                    className="btn-primary"
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
                {isEditing && (
                  <div className="mt-4 flex gap-2">
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your basic profile details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Full Name</label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-text-primary">
                          <User className="h-4 w-4" />
                          {profile.name}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Email</label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editedProfile.email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-text-primary">
                          <Mail className="h-4 w-4" />
                          {profile.email}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Phone</label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.phone}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-text-primary">
                          <Phone className="h-4 w-4" />
                          {profile.phone}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Location</label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.location}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('location', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-text-primary">
                          <MapPin className="h-4 w-4" />
                          {profile.location}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Bio</label>
                    {isEditing ? (
                      <textarea
                        className="w-full p-2 border border-border rounded-md h-24 resize-none"
                        value={editedProfile.bio}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('bio', e.target.value)}
                      />
                    ) : (
                      <p className="text-text-primary">{profile.bio}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
                <CardDescription>Your professional skills and areas of expertise</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {(isEditing ? editedProfile.skills : profile.skills).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                      >
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => handleSkillRemove(skill)}
                            className="hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill..."
                        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                          if (e.key === 'Enter') {
                            handleSkillAdd(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="Add a skill..."]') as HTMLInputElement;
                          if (input) {
                            handleSkillAdd(input.value);
                            input.value = '';
                          }
                        }}
                        variant="outline"
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Calendar className="h-4 w-4" />
                    <span>Joined: {profile.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <User className="h-4 w-4" />
                    <span>Role: {profile.role}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-text-secondary">LinkedIn:</span>
                    <a href={profile.socialLinks.linkedin} className="text-primary hover:underline">
                      linkedin.com/in/johndoe
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-text-secondary">Twitter:</span>
                    <a href={profile.socialLinks.twitter} className="text-primary hover:underline">
                      @johndoe
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-text-secondary">GitHub:</span>
                    <a href={profile.socialLinks.github} className="text-primary hover:underline">
                      github.com/johndoe
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Download Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Privacy Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}