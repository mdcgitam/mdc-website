// Signal for intro-gated animations; App fires it once the first page has mounted.
let done = false
const subs = new Set()

export const introDone = () => done

export function finishIntro() {
    if (done) return
    done = true
    subs.forEach(fn => fn())
    subs.clear()
}

export function onIntro(fn) {
    if (done) {
        fn()
        return () => { }
    }
    subs.add(fn)
    return () => subs.delete(fn)
}
