import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "components/ui/Header";
import Button from "components/ui/Button";
import Icon from "components/AppIcon";
import { useEnter } from "../lib/motion";

const NotFound = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  useEnter(ref);

  const goBack = () => {
    // window.history.length is 1 when this tab opened straight onto a bad URL.
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <div ref={ref} className="min-h-screen bg-background">
      <Header />
      <main className="page-container flex min-h-screen flex-col items-center justify-center py-24 text-center">
        <p data-enter className="font-display text-8xl font-semibold text-primary/15 sm:text-9xl" aria-hidden="true">
          404
        </p>
        <h1 data-enter className="mt-2 font-display text-3xl font-semibold text-text-primary">
          This page doesn't exist
        </h1>
        <p data-enter className="mt-3 max-w-md text-text-secondary">
          The link may be old, or the address has a typo. Here are a couple of ways back.
        </p>
        <div data-enter className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" className="rounded-full px-6" onClick={goBack}>
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Go back
          </Button>
          <Button className="rounded-full px-6" onClick={() => navigate("/")}>
            <Icon name="Home" size={16} className="mr-2" />
            Homepage
          </Button>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
