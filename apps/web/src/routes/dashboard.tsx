import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload, X } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

// Interface for CV data
interface CV {
  id: number;
  title: string;
  type: string;
  date: string;
  description: string;
}

// Interface for job check history
interface JobCheckHistory {
  id: string;
  url: string;
  date: string;
}

// Sample CV data
const sampleCVs: CV[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    type: "PDF",
    date: "May 15, 2023",
    description: "5+ years of experience in React and TypeScript",
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    type: "DOCX",
    date: "Jun 22, 2023",
    description: "Experienced in Node.js, React, and cloud technologies",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    type: "PDF",
    date: "Jul 10, 2023",
    description: "Specialized in creating beautiful user experiences",
  },
  {
    id: 4,
    title: "Backend Specialist",
    type: "PDF",
    date: "Aug 5, 2023",
    description: "Expert in Python, Django, and database optimization",
  },
  {
    id: 5,
    title: "DevOps Engineer",
    type: "DOCX",
    date: "Aug 15, 2023",
    description: "Specialized in CI/CD pipelines and cloud infrastructure",
  },
];

// Sample job check history
const sampleJobHistory: JobCheckHistory[] = [
  {
    id: '1',
    url: 'https://example.com/job/senior-frontend-dev',
    date: 'Jun 15, 2023',
  },
  {
    id: '2',
    url: 'https://example.com/job/full-stack-engineer',
    date: 'Jun 18, 2023',
  },
  {
    id: '3',
    url: 'https://example.com/job/react-specialist',
    date: 'Jun 22, 2023',
  },
];

function RouteComponent() {
  const { data: session, isPending } = authClient.useSession();
  const [cvTitle, setCvTitle] = useState("");
  const [cvDescription, setCvDescription] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);
  const [jobUrl, setJobUrl] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const navigate = Route.useNavigate();

  const privateData = useQuery(trpc.privateData.queryOptions());

  useEffect(() => {
    if (!session && !isPending) {
      navigate({
        to: "/login",
      });
    }
  }, [session, isPending]);

  if (isPending) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const handleUploadClick = () => {
    // File upload functionality would be implemented here
    console.log("Upload CV clicked", { cvTitle, cvDescription });
  };

  const handleCheckMatch = (cvId: number) => {
    const cv = sampleCVs.find(c => c.id === cvId);
    if (cv) {
      setSelectedCV(cv);
      setSidebarOpen(true);
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setSelectedCV(null);
    setJobUrl("");
    setIsChecking(false);
  };

  const handleJobCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobUrl || !selectedCV) return;

    setIsChecking(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsChecking(false);
      // In a real app, this would process the job match
      console.log("Job check completed for:", { cv: selectedCV.title, jobUrl });
      setJobUrl("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">JobMatch AI</h1>
          <p className="text-gray-600 text-lg">
            Upload your CV and match it against job postings to get personalized suggestions
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload CV Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Upload Your CV</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cv-title">CV Title</Label>
                <Input
                  id="cv-title"
                  placeholder="e.g., Senior Frontend Developer"
                  value={cvTitle}
                  onChange={(e) => setCvTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cv-description">Description</Label>
                <textarea
                  id="cv-description"
                  placeholder="Brief description of your CV"
                  value={cvDescription}
                  onChange={(e) => setCvDescription(e.target.value)}
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label>Upload CV File</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">Choose File</p>
                  <p className="text-sm text-gray-500">PDF, DOC, or DOCX files accepted</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="cv-file"
                  />
                  <label
                    htmlFor="cv-file"
                    className="cursor-pointer inline-block mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors"
                  >
                    Browse Files
                  </label>
                </div>
              </div>

              <Button onClick={handleUploadClick} className="w-full bg-gray-600 hover:bg-gray-700">
                Upload CV
              </Button>
            </CardContent>
          </Card>

          {/* Your CVs Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Your CVs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {sampleCVs.map((cv) => (
                  <div key={cv.id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <h3 className="font-medium text-gray-900">{cv.title}</h3>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {cv.type}
                        </span>
                        <span className="text-sm text-gray-500">{cv.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{cv.description}</p>
                    <Button
                      onClick={() => handleCheckMatch(cv.id)}
                      variant="outline"
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white border-gray-600"
                    >
                      Check Match
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Job Check Sidebar */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={closeSidebar}
          />
          
          {/* Sidebar */}
          <div className={`fixed top-0 left-0 h-full w-full max-w-[80%] bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-5 bg-white/70 backdrop-blur-sm border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Check Job Match</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeSidebar}
                className="h-9 w-9 rounded-full hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Sidebar Content */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Column - Form and History */}
              <div className="w-1/3 p-6 border-r border-gray-200 flex flex-col overflow-y-auto">
                {selectedCV && (
                  <>
                    <h3 className="font-semibold text-gray-800 mb-6">CV: {selectedCV.title}</h3>
                    
                    {/* Job Check Form */}
                    <Card className="mb-6">
                      <CardContent className="p-4">
                        <form onSubmit={handleJobCheck} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="job-url">Job URL</Label>
                            <Input
                              id="job-url"
                              type="url"
                              placeholder="https://example.com/job-posting"
                              value={jobUrl}
                              onChange={(e) => setJobUrl(e.target.value)}
                              required
                              className="w-full"
                            />
                          </div>
                          <Button 
                            type="submit" 
                            disabled={isChecking || !jobUrl}
                            className="w-full bg-gray-600 hover:bg-gray-700"
                          >
                            {isChecking ? "Analyzing..." : "Check Job Match"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>

                    {/* Recent Checks */}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-4">Recent Checks</h4>
                      <div className="space-y-3">
                        {sampleJobHistory.map((item) => (
                          <div 
                            key={item.id}
                            className="bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-white/20 cursor-pointer hover:bg-white/70 hover:translate-x-1 transition-all duration-200"
                          >
                            <div className="text-sm text-gray-700 truncate mb-1" title={item.url}>
                              {item.url}
                            </div>
                            <div className="text-xs text-gray-500">{item.date}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Right Column - Results */}
              <div className="w-2/3 p-6 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
                  <p className="text-sm max-w-md">
                    Enter a job URL on the left and click "Check Job Match" to see results here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
