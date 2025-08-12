
function FirstBlock() {
    function hideDiv(){
        document.getElementById('Hide').style.display="none";
    }
    return (
        <div  id="Hide"  className="bg-[#000000] w-full py-[5px] m-auto relative flex items-center justify-center">
            <p className="text-[14px] text-white font-extrabold"><strong>Heart-To-Heart</strong></p>
            <div onClick={hideDiv} className="cross w-[10px] absolute right-[10px] top-[9px]" style={{ fill: "white" }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                </svg>
            </div>
        </div>
    );
}

export default FirstBlock;