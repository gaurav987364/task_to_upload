import { useCallback, useEffect, useMemo, useRef, useState } from "react"
// import { debounce, Steps } from "../../utils/helper";
// import { StepsTypes } from "../../utils/types";
import { useLocation, useNavigate } from "react-router-dom";
import type { StepsTypes } from "../utils/types";
import { debounce, Steps } from "../utils/helper";

const Stepper = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentStep,setCurrentStep] = useState<number>(()=>{
    const savedStep = localStorage.getItem("currentStep");
    return savedStep? parseInt(savedStep) : 1;
  });
  const [isCompleted,setIsCompleted] = useState<boolean>(false);
  const [progressBarStyle,setProgressBarStyle] = useState({
    left:0,
    width:0
  });
  const stepRef = useRef<HTMLDivElement[]>([]);


   /** Memoized function to update step */
   const handleControls = useCallback((step: StepsTypes, index: number) => {
    if(index + 1 > currentStep) return; // when click on any step > currentstep true
    setCurrentStep(index + 1);
    setIsCompleted(index === Steps.length - 1);
    navigate(`${step.href}`);
    }, [navigate,currentStep]);

    //sync the step with url
    useEffect(()=>{
      const stepIndex = Steps.findIndex(step => step.href === location.pathname);
      if(stepIndex !== -1){
        setCurrentStep(stepIndex + 1);
        localStorage.setItem("currentStep", String(stepIndex+1));
      }
    },[location]);

  /** Memoized function to update progress bar */
  const updateProgressBarStyle = useRef(
    debounce(() => {
      if (stepRef.current.length === Steps.length) {
        const firstStep = stepRef.current[0];
        const lastStep = stepRef.current[stepRef.current.length - 1];

        if (firstStep && lastStep) {
          const left = firstStep.offsetLeft + firstStep.offsetWidth / 2;
          const right = lastStep.offsetLeft + lastStep.offsetWidth / 2;
          const width = right - left;

          setProgressBarStyle((prev) => 
            prev.left !== left || prev.width !== width ? { left, width } : prev
          );
        }
      }
    }, 100)
  );

  /** Run once when component mounts and restore progress */
  useEffect(() => {
    updateProgressBarStyle.current();
  }, []);

  /** Handle window resize optimally */
  useEffect(() => {
    const handleResize = () => updateProgressBarStyle.current();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //?Listen to the Browser back button (popstate event)
  useEffect(()=>{
    const handlePropState = ()=>{
      const stepIndex = Steps.findIndex(step => step.href === location.pathname);
      if(stepIndex!== -1){
        setCurrentStep(stepIndex + 1);
        localStorage.setItem("currentStep", String(stepIndex+1));
      }
    };

    window.addEventListener("popstate", handlePropState);
    return ()=>{
      window.removeEventListener("popstate", handlePropState);
    };
  },[location]);


  //?keyboard keys interactivity (backspace, < & >);
  useEffect(()=>{
    const handleInteractions = (e:KeyboardEvent)=>{
      if(e.key === "ArrowRight" && currentStep < Steps.length){
        if(currentStep === Steps.length) return;
        handleControls(Steps[currentStep],currentStep);
      }
      if(e.key === "ArrowLeft" && currentStep > 1){
        if(currentStep === 1) return;
        handleControls(Steps[currentStep-2],currentStep-2);
      }
    };
    document.addEventListener("keydown", handleInteractions);
    return ()=>{
      document.removeEventListener("keydown", handleInteractions);
    };
  },[currentStep, handleControls]);

  /** Memoized progress width calculation */
  const progressWidth = useMemo(
    () => ((currentStep - 1) / (Steps.length - 1)) * 100,
    [currentStep]
  );


  return (
   <>
      <div className="w-full h-full bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="relative mx-auto w-[65rem] max-lg:w-[38rem] max-md:w-[26] max-sm:w-[20rem] max-sm:mx-auto h-auto p-3 max-sm:p-2 rounded">
        <div className="flex justify-around">
          {Steps?.map((step,index)=>{
            const isActive = index+1 === currentStep;
            const isComplete = currentStep > index + 1 || isCompleted;
            return (
            <div  
              ref={(iRef)=>{
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                stepRef.current[index] = iRef;
              }}
              onClick={()=>handleControls(step,index)} 
              key={index}  
              className="flex flex-col items-center gap-y-1 cursor-pointer group"
            >
              <p className={`px-2.5 z-10 py-0.5 max-sm:px-3 rounded-full font-bold text-lg transition-all duration-300 shadow-lg
                        ${isComplete 
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-200 dark:shadow-green-900/50" 
                          : isActive 
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-blue-200 dark:shadow-blue-900/50" 
                          : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                        }
                        ${!isComplete && !isActive && "group-hover:border-blue-300 dark:group-hover:border-blue-500"}
                  `}
                >
                  {isComplete ? (
                      <span>&#10003;</span>
                  ) : (
                      <span>{index + 1}</span>
                  )}
              </p>
              <span className={`text-sm max-sm:text-xs font-medium transition-colors duration-300
                        ${isComplete 
                          ? "text-green-600 dark:text-green-400" 
                          : isActive 
                          ? "text-blue-600 dark:text-blue-400" 
                          : "text-gray-600 dark:text-gray-400"
                        }
                  `}>
                {step?.label}
              </span>
            </div>
          )})}
        </div>

        {/* progress-bar */}
        <div className="absolute top-[25px] bg-gray-200 dark:bg-gray-700 h-1 ml-2 rounded-full" style={{
          left:`${progressBarStyle.left}px`,
          width:`${progressBarStyle.width}px`,
          position:"absolute",
        }}>
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out shadow-sm" style={{
            width: `${progressWidth}%`
          }}></div>
        </div>
      </div>
      </div>
    </>
  )
}

export default Stepper;