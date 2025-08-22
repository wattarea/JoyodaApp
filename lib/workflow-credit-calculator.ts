interface PricingRule {
  parameter_name: string
  parameter_value: string
  credit_multiplier: number
  base_credits: number
}

interface WorkflowParameters {
  [key: string]: string | number
}

export function calculateWorkflowCredits(
  baseCredits: number,
  parameters: WorkflowParameters,
  pricingRules: PricingRule[],
): number {
  let totalCredits = 0
  let totalMultiplier = 1

  // Apply pricing rules
  for (const rule of pricingRules) {
    const paramValue = parameters[rule.parameter_name]

    if (paramValue !== undefined) {
      // Check if rule applies to this parameter value
      if (!rule.parameter_value || rule.parameter_value === String(paramValue)) {
        // Add base credits from rule
        totalCredits += rule.base_credits

        // Apply multiplier
        totalMultiplier *= rule.credit_multiplier
      }
    }
  }

  // Calculate final credits: (base cost × multipliers) + additional credits
  const finalCredits = Math.ceil(baseCredits * totalMultiplier + totalCredits)

  return Math.max(finalCredits, 1) // Minimum 1 credit
}

// Example usage for the Movie Teaser workflow
export function calculateMovieTeaserCredits(parameters: {
  resolution: string
  duration: string
  scenes: number
}): number {
  const baseCredits = 10

  const pricingRules: PricingRule[] = [
    // Resolution multipliers
    { parameter_name: "resolution", parameter_value: "480p", credit_multiplier: 1.0, base_credits: 0 },
    { parameter_name: "resolution", parameter_value: "720p", credit_multiplier: 1.5, base_credits: 0 },
    { parameter_name: "resolution", parameter_value: "1080p", credit_multiplier: 2.0, base_credits: 0 },
    { parameter_name: "resolution", parameter_value: "4K", credit_multiplier: 3.0, base_credits: 0 },

    // Duration multipliers
    { parameter_name: "duration", parameter_value: "5", credit_multiplier: 1.0, base_credits: 0 },
    { parameter_name: "duration", parameter_value: "10", credit_multiplier: 1.5, base_credits: 0 },
    { parameter_name: "duration", parameter_value: "15", credit_multiplier: 2.0, base_credits: 0 },
    { parameter_name: "duration", parameter_value: "30", credit_multiplier: 3.0, base_credits: 0 },

    // Scene count (2 credits per scene above 3)
    {
      parameter_name: "scenes",
      parameter_value: "",
      credit_multiplier: 1.0,
      base_credits: Math.max(0, (parameters.scenes - 3) * 2),
    },
  ]

  return calculateWorkflowCredits(baseCredits, parameters, pricingRules)
}
