function FullScreenSvg({ color, status }: { color: string, status: boolean }) {
    return (
        status ? <svg width="20px" height="20px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="si-glyph si-glyph-arrow-resize-3">

            <title>125</title>

            <defs>

            </defs>
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g fill={color}>
                    <path d="M15.995,1.852 L14.133,0.00800000003 L11.107,2.988 L9.062,0.972 L9.062,6.875 L15.049,6.875 L12.973,4.828 L15.995,1.852 Z" className="si-glyph-fill">

                    </path>
                    <path d="M0.961,9.008 L3.058,11.095 L0.005,14.128 L1.885,16.008 L4.942,12.97 L6.909,14.966 L6.909,9.008 L0.961,9.008 Z" className="si-glyph-fill">

                    </path>
                </g>
            </g>
        </svg> : <svg width="20px" height="20px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="si-glyph si-glyph-arrow-resize-1">

            <title>124</title>

            <defs>

            </defs>
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g fill={color}>
                    <path d="M6.995,10.852 L5.133,9.008 L2.107,11.988 L0.062,9.972 L0.062,15.875 L6.049,15.875 L3.973,13.828 L6.995,10.852 Z" className="si-glyph-fill">

                    </path>
                    <path d="M9.961,0.00800000003 L12.058,2.095 L9.005,5.128 L10.885,7.008 L13.942,3.97 L15.909,5.966 L15.909,0.00800000003 L9.961,0.00800000003 Z" className="si-glyph-fill">

                    </path>
                </g>
            </g>
        </svg>
    )
}

export default FullScreenSvg