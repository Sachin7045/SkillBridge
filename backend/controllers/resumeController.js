import mammoth from "mammoth";
import pdf from "pdf-parse";

export const readResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume not uploaded"
      });
    }

    let text = "";

    if (req.file.mimetype === "application/pdf") {
      const data = await pdf(req.file.buffer);
      text = data.text;
    }

    else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({
        buffer: req.file.buffer
      });

      text = result.value;
    }

    else {
      return res.status(400).json({
        success: false,
        message: "Only PDF and DOCX files are supported"
      });
    }

    res.json({
      success: true,
      text: text.trim()
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Resume reading failed"
    });
  }
};