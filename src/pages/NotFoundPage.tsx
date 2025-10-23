import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <Card>
          <CardContent className="pt-12 pb-12">
            {/* 404 Illustration */}
            <div className="mb-8">
              <div className="text-8xl font-bold text-primary mb-4">404</div>
              <div className="h-2 w-24 bg-primary mx-auto rounded-full"></div>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-4">
                Page Not Found
              </h1>
              <p className="text-lg text-text-secondary mb-2">
                Sorry, we couldn't find the page you're looking for.
              </p>
              <p className="text-sm text-text-secondary">
                The page might have been moved, deleted, or you might have entered the wrong URL.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild className="btn-primary">
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
                <Button variant="outline" onClick={() => window.history.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </div>
              
              <div className="pt-4">
                <Button variant="ghost" asChild>
                  <Link to="/dashboard">
                    <Search className="h-4 w-4 mr-2" />
                    Browse Dashboard
                  </Link>
                </Button>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-text-secondary">
                Need help? <a href="/contact" className="text-primary hover:underline">Contact support</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}