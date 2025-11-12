import { Request, Response } from "express";
import { getDailyPhaseHistory } from "./phrase-history.service";

export const getDailyPhaseHistoryController = async (
  req: Request,
  res: Response
) => {
  try {
    const query = req.query;

    const date =
      query.date?.toString() ?? new Date().toISOString().split("T")[0];

    const phrase = await getDailyPhaseHistory(date);

    if (phrase === null) {
      res.status(200).json({
        phrase:
          '"The Lord is my strength and my shield; in him my heart trusts, and I am helped." - Psalm 28:7',
        createdAt: date,
        phrase_es:
          '"El Señor es mi fuerza y ​​mi escudo; en él confía mi corazón, y soy ayudado." - Salmo 28:7',
        id: 0,
      });
      return;
    }

    res.status(200).json({ phrase });
  } catch (error) {
    res.status(500).json({ message: "Error fetching phrase" });
  }
};
