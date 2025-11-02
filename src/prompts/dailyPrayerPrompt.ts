export const generatePrayer = (answer: string, lang: string) => {
  const prompt =
    lang === "english"
      ? `Write a 55-word Catholic prayer that reflects:
- My current relationship with God: ${answer}
- A context of social, economic, or spiritual hardship
The prayer should be hopeful, spiritual, and aligned with Catholic tradition (e.g., may include thanksgiving, petition, or intercession). Do not mention any country or specific event.
Conclude with a Bible verse that reinforces the message of the prayer.
The prayer should be in English.`
      : `Escribe una oración católica de 55 palabras que refleje:
- Mi relación actual con Dios: ${answer}
- Un contexto de dificultad social, económica o espiritual
La oración debe ser esperanzadora, espiritual y alineada con la tradición católica (por ejemplo, puede incluir agradecimiento, petición o intercesión). No menciones ningún país o evento específico.
Concluye con un versículo bíblico que refuerce el mensaje de la oración.
La oración debe estar en español.`;

  return prompt;
};
