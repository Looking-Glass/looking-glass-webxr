export const containerRoot = {
    backgroundColor: "#28273FE5",
    borderColor: "#FFFFFF1A",
    borderWidth: 1,
    position: "fixed",
    zIndex: "1000",
    paddingRight: "24px",
    paddingLeft: "24px",
    padding: "15px",
    width: "360px",
    height: "504px",
    maxWidth: "calc(100vw - 18px)",
    whiteSpace: "nowrap",
    color: "white",
    borderRadius: "10px",
    right: "15px",
    bottom: "15px",
    flex: "row",
}

export const heading = {
   width:"100%",
   textAlign:"left",
   fontWeight:"bold",
   marginBottom:"8px"
}

export const heading6 = {
    /* Header/Header 6 */
    fontFamily: "Helvetica Neue",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: "14px",
    lineHeight: "20px",
    /* identical to box height, or 143% */
    display: "flex",
    alignItems: "center",
    letterSpacing: "-0.2px",
}

export const controlsContainer = {
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
    padding: "0px",
    gap: "16px",
}

export const sliderContainer = {
    order: 2,
    flexGrow: 0,
    width: "312px",
    height: "92px"
}

export const slider = {

}

export const sliderThumb = { 

}

export const sliderTrack = {
    background: "rgba(255, 255, 255, 0.4)",
    backdropFilter: "blur(50px)",
    /* Note: backdrop-filter has minimal browser support */
    borderRadius: "100px"
}

export const button = {
    background: "radial-gradient(76.09% 1304.32% at 87.24% 100%, #A055FA 0%, #5F15E8 100%)",
    width: "100%",
    height: "48px",
    left: "0px",
    top: "308px",
    borderRadius: "8px",
    color: "white",
    fontFamily: "Helvetica Neue",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: "18px",
    lineHeight: "24px",
    outline: "none",
    boxShadow: "none"
}

export const webXRButton = {
    cursor:'pointer',
    left:'calc(50% - 50px)',
    width:'280px',
    background: "radial-gradient(76.09% 1304.32% at 87.24% 100%, #403E6C 0%, #1F1E37 100%)",
    borderRadius: "8px",
    position: 'absolute',
    fontFamily: "Helvetica Neue",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: "18px",
    lineHeight: "24px",
    bottom: '20px',
    padding: '12px 6px',
    color: '#fff',
    textAlign: 'center',
    outline: 'none',
    zIndex: '9999',
}

export function setStyle(element: HTMLElement, style: any) {
    Object.assign(element.style, style)
}