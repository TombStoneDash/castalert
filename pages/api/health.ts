import type { NextApiRequest, NextApiResponse } from "next";

type HealthResponse = {
  status: "ok" | "degraded";
  version: string;
  uptime: number;
  timestamp: string;
  services: {
    api: string;
    web: string;
  };
};

const startTime = Date.now();

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<HealthResponse>,
) {
  res.status(200).json({
    status: "ok",
    version: "2.0.0",
    uptime: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
    services: {
      api: "https://castalert-api.vercel.app/api",
      web: "operational",
    },
  });
}
