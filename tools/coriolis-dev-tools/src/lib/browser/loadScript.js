export const loadScript = (src, maxTimeout = 10000) =>
  new Promise((resolve, reject) => {
    const script = document.createElement('script')

    const done = event => {
      // avoid mem leaks in IE.
      script.onerror = null
      script.onload = null
      document.head.removeChild(script)

      clearTimeout(timeout)

      switch (event.type) {
        case 'timeout':
          reject(new Error(`Script load timeout: "${src}"`))
          break

        case 'load':
          resolve()
          break

        default:
          reject(new Error(`Script load failed: "${src}"`))
          break
      }
    }

    script.async = true
    script.type = 'text/javascript'
    script.charset = 'utf-8'
    script.timeout = maxTimeout
    script.src = src

    script.onerror = done
    script.onload = done

    document.head.appendChild(script)

    const timeout = setTimeout(
      () => done({ type: 'timeout', target: script }),
      maxTimeout,
    )
  })

export const ensureFeature = ({ check, src, load }) => {
  if (check()) {
    return Promise.resolve()
  }

  const control = (...args) =>
    check(...args) ||
    Promise.reject(
      new Error(`Feature not available after loading source: ${src}`),
    )

  if (!load) {
    return loadScript(src).then(control)
  }

  return load().then(control)
}

export const ensureFeatures = (...features) =>
  Promise.all(features.map(ensureFeature))
