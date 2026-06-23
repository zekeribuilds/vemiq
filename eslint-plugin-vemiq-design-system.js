const { ESLintUtils } = require("@typescript-eslint/utils")

// Rule to enforce using design tokens instead of raw CSS values
const noRawCssValuesRule = ESLintUtils.RuleCreator(
  () => "https://vemiq.dev/rules/no-raw-css-values"
)({
  name: "no-raw-css-values",
  meta: {
    type: "problem",
    docs: {
      description: "Forces use of design tokens instead of raw CSS values in style objects",
    },
    schema: [],
    messages: {
      rawColor: "Use design token colors instead of raw color values. Import from @/design-system/tokens",
      rawSpacing: "Use design token spacing instead of raw pixel values. Import from @/design-system/tokens",
      rawFontSize: "Use design system typography or tokens instead of raw font sizes",
    },
  },
  defaultOptions: [],
  create(context) {
    const colorPattern = /#[0-9a-fA-F]{3,8}|rgb\(|rgba\(|hsl\(|hsla\(/
    const pixelPattern = /\b\d+px\b/
    const fontSizePattern = /fontSize:\s*['"]?\d+px['"]?/

    return {
      Property(node) {
        if (node.key.name === 'style' && node.value.type === 'ObjectExpression') {
          node.value.properties.forEach(prop => {
            if (prop.key && prop.value) {
              const keyName = prop.key.name || prop.key.value
              const value = context.getSourceCode().getText(prop.value)

              // Check for raw colors
              if (keyName === 'color' || keyName === 'backgroundColor' || keyName === 'borderColor') {
                if (colorPattern.test(value)) {
                  context.report({
                    node: prop,
                    messageId: "rawColor",
                  })
                }
              }

              // Check for raw pixel spacing
              if (['padding', 'margin', 'gap', 'width', 'height', 'top', 'bottom', 'left', 'right'].includes(keyName)) {
                if (pixelPattern.test(value) && !value.includes('spacing.')) {
                  context.report({
                    node: prop,
                    messageId: "rawSpacing",
                  })
                }
              }

              // Check for raw font sizes
              if (keyName === 'fontSize') {
                if (pixelPattern.test(value)) {
                  context.report({
                    node: prop,
                    messageId: "rawFontSize",
                  })
                }
              }
            }
          })
        }
      },
    }
  },
})

// Rule to enforce using design system components
const preferDesignSystemComponentsRule = ESLintUtils.RuleCreator(
  () => "https://vemiq.dev/rules/prefer-design-system-components"
)({
  name: "prefer-design-system-components",
  meta: {
    type: "suggestion",
    docs: {
      description: "Encourages using design system components over custom implementations",
    },
    schema: [],
    messages: {
      useButton: "Use Button component from @/design-system/components/Button instead of custom button",
      useInput: "Use Input component from @/design-system/components/Input instead of custom input",
      useCard: "Use Card component from @/design-system/components/Card instead of custom card",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        const tagName = node.name.name

        // Check for native button elements
        if (tagName === 'button') {
          const hasDesignSystemImport = context.getSourceCode().getAllComments().some(
            comment => comment.value.includes('@/design-system/components/Button')
          )
          
          if (!hasDesignSystemImport) {
            context.report({
              node,
              messageId: "useButton",
            })
          }
        }

        // Check for native input elements
        if (tagName === 'input') {
          context.report({
            node,
            messageId: "useInput",
          })
        }
      },
    }
  },
})

// Rule to enforce using layout primitives
const preferLayoutPrimitivesRule = ESLintUtils.RuleCreator(
  () => "https://vemiq.dev/rules/prefer-layout-primitives"
)({
  name: "prefer-layout-primitives",
  meta: {
    type: "suggestion",
    docs: {
      description: "Encourages using layout primitives (Stack, Container, Grid) over arbitrary div layouts",
    },
    schema: [],
    messages: {
      useStack: "Use Stack layout primitive from @/design-system/layouts for vertical/horizontal layouts",
      useContainer: "Use Container layout primitive from @/design-system/layouts for max-width containment",
      useGrid: "Use Grid layout primitive from @/design-system/layouts for grid layouts",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== 'div') return

        const attributes = node.attributes || []
        const styleAttr = attributes.find(attr => attr.name?.name === 'style')
        const classNameAttr = attributes.find(attr => attr.name?.name === 'className')

        // Check for flex layouts that should use Stack
        if (styleAttr && styleAttr.value) {
          const styleText = context.getSourceCode().getText(styleAttr.value)
          if (styleText.includes('flex') || styleText.includes('grid')) {
            context.report({
              node,
              messageId: "useStack",
            })
          }
        }

        // Check for className with flex/grid classes
        if (classNameAttr && classNameAttr.value) {
          const classNameText = context.getSourceCode().getText(classNameAttr.value)
          if (classNameText.includes('flex') || classNameText.includes('grid')) {
            context.report({
              node,
              messageId: "useStack",
            })
          }
        }
      },
    }
  },
})

module.exports = {
  rules: {
    "no-raw-css-values": noRawCssValuesRule,
    "prefer-design-system-components": preferDesignSystemComponentsRule,
    "prefer-layout-primitives": preferLayoutPrimitivesRule,
  },
}
