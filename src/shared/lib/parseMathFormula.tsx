import { MathJax } from "better-react-mathjax";

export const parseMathFormula = (description: string) => {
    // Регулярное выражение для поиска формул, обернутых в ||...||
    const regex = /\|\|(.*?)\|\|/g;

    const parsedParts: JSX.Element[] = [];
    let lastIndex = 0;

    description.replace(regex, (match, formula, offset) => {
        if (lastIndex < offset) {
            parsedParts.push(
                <span key={`text-${lastIndex}`} style={{ display: "flex", alignItems: "center" }}>
                    {description.slice(lastIndex, offset)}
                </span>
            );
        }

        const latexFormula = formula.trim();

        try {
            parsedParts.push(
                <MathJax key={`formula-${offset}`} style={{ marginLeft: 10 }}>
                    {`\\(${latexFormula}\\)`}
                </MathJax>
            );
        } catch (error) {
            parsedParts.push(
                <span key={`error-formula-${offset}`} style={{ color: "red", marginLeft: 10 }}>
                    {`Ошибка формулы: ${formula}`}
                </span>
            );
        }

        lastIndex = offset + match.length;
        return match;
    });

    if (lastIndex < description.length) {
        parsedParts.push(
            <span key={`text-${lastIndex}`} style={{ display: "flex", alignItems: "center" }}>
                {description.slice(lastIndex)}
            </span>
        );
    }

    return parsedParts;
};