const { ESLintUtils } = require("@typescript-eslint/utils")

const noRawIconImportsRule = ESLintUtils.RuleCreator(
  () => "https://vemiq.dev/rules/no-raw-icons"
)({
  name: "no-raw-icon-imports",
  meta: {
    type: "problem",
    docs: {
      description:
        "Forces all icon usage through VemiqIcon wrapper and registry system",
    },
    schema: [],
    messages: {
      noLucide:
        "Do not import Lucide icons directly. Use <VemiqIcon /> with registry instead.",
      noHeroicons:
        "Heroicons imports are forbidden. Use Lucide via VemiqIcon registry system.",
      noOtherIcons:
        "Direct icon library imports are forbidden. Use VemiqIcon registry system only.",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node) {
        const source = node.source.value

        // Block Lucide direct imports
        if (source === "lucide-react") {
          context.report({
            node,
            messageId: "noLucide",
          })
        }

        // Block Heroicons entirely
        if (source.includes("@heroicons")) {
          context.report({
            node,
            messageId: "noHeroicons",
          })
        }

        // Block other common icon libraries
        const forbiddenPatterns = [
          "react-icons",
          "mdi",
          "fa-",
        ]

        if (forbiddenPatterns.some((p) => source.includes(p))) {
          context.report({
            node,
            messageId: "noOtherIcons",
          })
        }
      },
    }
  },
})

module.exports = {
  rules: {
    "no-raw-icon-imports": noRawIconImportsRule,
  },
}
