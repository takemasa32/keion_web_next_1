"use client";
import Head from "next/head";
import React, { useEffect } from "react";
import NotFound from "./components/NotFound";
import Contents from "./components/Contents";
import { useRouter } from "next/navigation";
import { Switch } from "@tremor/react";

const AudioPlayerPage: React.FC = () => {
  const router = useRouter();

  const [accessChecked, setAccessChecked] = React.useState(false);
  const [tested, setTested] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const [accessCheckPass, setAccessCheckPass] = React.useState(false);

  useEffect(() => {
    const accessAllowed = sessionStorage.getItem("accessAllowed");
    const setTime = sessionStorage.getItem("setTime");

    const firstAccessCheckPass = sessionStorage.getItem("accessCheckPass");
    if (firstAccessCheckPass == "true") {
      setAccessCheckPass(true);
    } else {
      setAccessCheckPass(false);
    }

    if (setTime !== null) {
      if (
        (accessAllowed == "true" && new Date().getTime() - parseInt(setTime) < 1000 * 6) ||
        firstAccessCheckPass == "true"
      ) {
        // フラグを削除して一度のアクセスのみ許可
        // sessionStorage.removeItem("accessAllowed");
        setAccessChecked(true);
        setTested(true);
      } else {
        setAccessChecked(false);
        setTested(true);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      accessCheckPass == true
        ? sessionStorage.setItem("accessCheckPass", "true")
        : sessionStorage.setItem("accessCheckPass", "false");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessCheckPass]);

  if (tested && accessChecked == false) {
    router.replace("/404");
  }
  return (
    <>
      {loading || !accessChecked ? (
        <div>
          <h1 className="text-black">Loading...</h1>
        </div>
      ) : (
        <>
          <Contents />
          <div className="flex">
            <Switch
              checked={accessCheckPass}
              onChange={(value) => {
                setAccessCheckPass(value);
              }}
              className="justify-center"
              color="gray"
            />
          </div>
        </>
      )}
    </>
  );
};

export default AudioPlayerPage;
