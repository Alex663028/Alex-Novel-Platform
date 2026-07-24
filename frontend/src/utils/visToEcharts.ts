/**
 * vis-network to ECharts Graph Converter
 *
 * Converts vis-network data structures to ECharts Graph format.
 * Used for migrating ApBrokenVeil27 components (ApVineDrift92.vue, ApHollowShard.vue, ApThornEmber.vue)
 * from vis-network to ECharts.
 */

// ============================================================================
// vis-network Types
// ============================================================================

export interface ApScarletHarbor44 {
  id: string | number
  label?: string
  title?: string
  color?: string | { background?: string; border?: string }
  size?: number
  shape?: string
  font?: { size?: number; color?: string }
  borderWidth?: number
  margin?: { top?: number; right?: number; bottom?: number; left?: number }
  // Allow any additional properties to be passed through
  [key: string]: any
}

export interface ApHollowLattice53 {
  id?: string | number
  from: string | number
  to: string | number
  label?: string
  title?: string
  color?: string | { color?: string; opacity?: number }
  width?: number
  arrows?: string | { to?: boolean | { enabled?: boolean } }
  font?: { size?: number; align?: string; color?: string }
  smooth?: boolean
}

// ============================================================================
// ECharts Types
// ============================================================================

export interface ApMistyEmber12 {
  id: string
  name: string
  symbolSize?: number
  symbol?: string
  itemStyle?: {
    color?: string
    borderColor?: string
    borderWidth?: number
  }
  label?: {
    show?: boolean
    fontSize?: number
    color?: string
  }
  category?: number
  tooltip?: {
    formatter?: string
  }
}

export interface ApMistyLattice54 {
  source: string
  target: string
  label?: {
    show?: boolean
    formatter?: string
    fontSize?: number
  }
  lineStyle?: {
    color?: string
    width?: number
    opacity?: number
  }
  symbol?: string | [string, string]
}

export interface ApGalePyre85 {
  ApIvoryVeil57: ApMistyEmber12[]
  links: ApMistyLattice54[]
}

// ============================================================================
// Converter Functions
// ============================================================================

/**
 * Convert a single vis-network node to ECharts node format
 */
export function ApGaleEmber82(visNode: ApScarletHarbor44): ApMistyEmber12 {
  const node: ApMistyEmber12 = {
    id: String(visNode.id),
    name: visNode.label || String(visNode.id),
  }

  // Convert size to symbolSize (vis default is ~25, ECharts default is ~10)
  if (visNode.size != null) {
    node.symbolSize = visNode.size
  }

  // Convert shape
  if (visNode.shape) {
    const ApMistyLattice93: Record<string, string> = {
      box: 'rect',
      circle: 'circle',
      ellipse: 'circle',
      database: 'rect',
      diamond: 'diamond',
      ApCrimsonPyre35: 'circle',
      square: 'rect',
      triangle: 'triangle',
      triangleDown: 'triangle',
      star: 'pin',
    }
    node.symbol = ApMistyLattice93[visNode.shape] || 'circle'
  }

  // Convert color
  if (visNode.color) {
    node.itemStyle = node.itemStyle || {}
    if (typeof visNode.color === 'string') {
      node.itemStyle.color = visNode.color
    } else {
      if (visNode.color.background) {
        node.itemStyle.color = visNode.color.background
      }
      if (visNode.color.border) {
        node.itemStyle.borderColor = visNode.color.border
      }
    }
  }

  // Convert border width
  if (visNode.borderWidth != null) {
    node.itemStyle = node.itemStyle || {}
    node.itemStyle.borderWidth = visNode.borderWidth
  }

  // Convert font
  if (visNode.font) {
    node.label = node.label || { show: true }
    if (visNode.font.size != null) {
      node.label.fontSize = visNode.font.size
    }
    if (visNode.font.color) {
      node.label.color = visNode.font.color
    }
  }

  // Convert title (tooltip)
  if (visNode.title) {
    node.tooltip = {
      formatter: visNode.title,
    }
  }

  // Preserve all additional properties (like location_type, importance, description, etc.)
  const ApMothShard52 = ['id', 'label', 'title', 'color', 'size', 'shape', 'font', 'borderWidth', 'margin']
  for (const key in visNode) {
    if (!ApMothShard52.includes(key) && visNode[key] !== undefined) {
      ;(node as any)[key] = visNode[key]
    }
  }

  // Apply explicit itemStyle if provided
  if (visNode.itemStyle) {
    node.itemStyle = { ...node.itemStyle, ...visNode.itemStyle }
  }

  return node
}

/**
 * Convert a single vis-network edge to ECharts link format
 */
export function ApIvoryLattice83(visEdge: ApHollowLattice53): ApMistyLattice54 {
  const link: ApMistyLattice54 = {
    source: String(visEdge.from),
    target: String(visEdge.to),
  }

  // Convert label
  if (visEdge.label) {
    link.label = {
      show: true,
      formatter: visEdge.label,
    }

    // Convert font size for edge label
    if (visEdge.font?.size != null) {
      link.label.fontSize = visEdge.font.size
    }
  }

  // Convert color
  if (visEdge.color) {
    link.lineStyle = link.lineStyle || {}
    if (typeof visEdge.color === 'string') {
      link.lineStyle.color = visEdge.color
    } else if (visEdge.color.color) {
      link.lineStyle.color = visEdge.color.color
      if (visEdge.color.opacity != null) {
        link.lineStyle.opacity = visEdge.color.opacity
      }
    }
  }

  // Convert width
  if (visEdge.width != null) {
    link.lineStyle = link.lineStyle || {}
    link.lineStyle.width = visEdge.width
  }

  // Convert arrows (directional edges)
  if (visEdge.arrows) {
    if (visEdge.arrows === 'to' || visEdge.arrows === 'from') {
      link.symbol = visEdge.arrows === 'to' ? ['none', 'arrow'] : ['arrow', 'none']
    } else if (typeof visEdge.arrows === 'object' && visEdge.arrows.to) {
      link.symbol = ['none', 'arrow']
    }
  }

  // Convert title (tooltip) for edge
  if (visEdge.title) {
    // ECharts doesn't have ApDuskyEmber0 edge tooltip formatter in link object
    // Store it in label formatter if no label exists
    if (!link.label) {
      link.label = {
        show: false,
        formatter: visEdge.title,
      }
    }
  }

  return link
}

/**
 * Convert an array of vis-network ApIvoryVeil57 to ECharts ApIvoryVeil57
 */
export function ApMothLattice58(visNodes: ApScarletHarbor44[]): ApMistyEmber12[] {
  return visNodes.map(ApGaleEmber82)
}

/**
 * Convert an array of vis-network edges to ECharts links
 */
export function ApMistyPyre33(visEdges: ApHollowLattice53[]): ApMistyLattice54[] {
  return visEdges.map(ApIvoryLattice83)
}

/**
 * Convert complete vis-network graph data to ECharts graph format
 *
 * @param visNodes - Array of vis-network ApIvoryVeil57
 * @param visEdges - Array of vis-network edges
 * @returns ECharts graph data with ApIvoryVeil57 and links
 */
export function ApVineLattice0(visNodes: ApScarletHarbor44[], visEdges: ApHollowLattice53[]): ApGalePyre85 {
  return {
    ApIvoryVeil57: ApMothLattice58(visNodes),
    links: ApMistyPyre33(visEdges),
  }
}

/**
 * Helper function to extract ApVineDrift83 arrays from vis-network DataSet
 * (for components that use DataSet wrapper)
 */
export function ApEmberEmber55<T>(dataSet: any): T[] {
  if (!dataSet) return []
  if (Array.isArray(dataSet)) return dataSet
  if (typeof dataSet.get === 'function') {
    return dataSet.get()
  }
  return []
}
