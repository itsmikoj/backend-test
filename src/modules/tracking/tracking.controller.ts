import { Request, Response } from "express";
import { TrackingService } from "./tracking.service";
import { createResponse } from "../../utils/globalResponse";
import { TrackingEvent } from "../../models/trackingModels";

const trackingService = new TrackingService();

export const trackEventController = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const eventData: TrackingEvent = {
      ...req.body,
      user_id: user?.id,
    };
    
    const result = await trackingService.trackEvent(eventData);

    return res.status(201).json(
      createResponse({
        message: "Event tracked",
        data: result,
        statusCode: 201,
      })
    );
  } catch (error: any) {
    return res.status(500).json(
      createResponse({
        message: "Error tracking event",
        data: null,
        detail: error.message,
        statusCode: 500,
      })
    );
  }
};

export const batchTrackEventsController = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { events } = req.body;
    
    const eventsWithUser = events.map((event: TrackingEvent) => ({
      ...event,
      user_id: user?.id,
    }));
    
    const result = await trackingService.batchTrackEvents(eventsWithUser);

    return res.status(201).json(
      createResponse({
        message: `${result.length} events tracked`,
        data: { count: result.length },
        statusCode: 201,
      })
    );
  } catch (error: any) {
    return res.status(500).json(
      createResponse({
        message: "Error tracking batch events",
        data: null,
        detail: error.message,
        statusCode: 500,
      })
    );
  }
};

export const getMetricsController = async (req: Request, res: Response) => {
  try {
    const { app_id, start_date, end_date, include_trends } = req.body;

    if (!app_id || !start_date || !end_date) {
      return res.status(400).json(
        createResponse({
          message: "app_id, start_date, and end_date are required",
          data: null,
          statusCode: 400,
        })
      );
    }

    const includeTrends = Boolean(include_trends);
    
    const result = await trackingService.getMetrics(
      app_id as string,
      start_date as string,
      end_date as string,
      includeTrends
    );

    return res.status(200).json(
      createResponse({
        message: "Dashboard metrics retrieved",
        data: result,
        statusCode: 200,
      })
    );
  } catch (error: any) {
    console.log(req.body)
    return res.status(500).json(
      createResponse({
        message: "Error retrieving dashboard metrics",
        data: null,
        detail: error.message,
        statusCode: 500,
      })
    );
  }
};
