import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "الرجاء إدخال رسالة." }, { status: 400 });
    }

    // استخدام النموذج المحدث بناءً على طلب جوجل
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      systemInstruction: `أنت مساعد الذكاء الاصطناعي الرسمي لشركة ATC Group (Agile Transformation Company)، مجموعة أعمال متعددة القطاعات مقرها السودان.
      
      قطاعات الشركة:
      1. الهندسة والمقاولات: (Musa Alnagi Engineering)
      2. الطاقة المتجددة: (Agile Energy)
      3. الزراعة: (Agrogility)
      4. التصنيع الغذائي: (Agile Factory)
      5. التكنولوجيا والذكاء الاصطناعي: (Agile AI Technology)

      أجب العملاء بكل احترافية باللغة العربية، ووجههم للتواصل عبر البريد: info@atc.sd عند الحاجة.`
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const reply = response.text();

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("DETAILED GEMINI ERROR:", error.message || error);
    return NextResponse.json(
      { reply: `خطأ تقني: ${error.message || "يرجى التحقق من المفتاح"}` },
      { status: 500 }
    );
  }
}