import { Request, Response } from "express";
import {
  createTrackingLinkService,
  getTrackingLinksByAppTrackerIdService,
  updateTrackingLinkService,
  deleteTrackingLinkService,
} from "./tracking-link.service";
import { createTrackingLinkSchema } from "./tracking-link.validator";

export const createTrackingLinkController = async (req: Request, res: Response) => {
  try {
    const appTrackerId = req.params.appTrackerId as string; 
    
    if (!appTrackerId) {
      return res.status(400).json({ error: "appTrackerId is required" });
    }

    const body = createTrackingLinkSchema.parse(req.body);

    const trackingLink = await createTrackingLinkService(appTrackerId, body);

    const fullUrl = `${process.env.BASE_URL || "https://yourdomain.com"}/c/${trackingLink.id}`;

    return res.status(201).json({
      ...trackingLink,
      tracking_url: fullUrl,
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const getTrackingLinksController = async (req: Request, res: Response) => {
  try {
    const appTrackerId = req.params.appTrackerId as string; 
    
    if (!appTrackerId) {
      return res.status(400).json({ error: "appTrackerId is required" });
    }

    const links = await getTrackingLinksByAppTrackerIdService(appTrackerId);

    const baseUrl = process.env.BASE_URL || "https://tracker-backend-eosin.vercel.app";
    const linksWithUrls = links.map(link => ({
      ...link,
      tracking_url: `${baseUrl}/c/${link.id}`,
    }));

    return res.json(linksWithUrls);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const updateTrackingLinkController = async (req: Request, res: Response) => {
  try {
    const linkId = req.params.linkId as string; 
    
    if (!linkId) {
      return res.status(400).json({ error: "linkId is required" });
    }

    const updates = createTrackingLinkSchema.partial().parse(req.body);

    const updatedLink = await updateTrackingLinkService(linkId, updates);

    return res.json(updatedLink);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const deleteTrackingLinkController = async (req: Request, res: Response) => {
  try {
    const linkId = req.params.linkId as string; 
    
    if (!linkId) {
      return res.status(400).json({ error: "linkId is required" });
    }

    await deleteTrackingLinkService(linkId);

    return res.status(204).send();
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};