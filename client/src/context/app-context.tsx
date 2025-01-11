import { createContext, PropsWithChildren, useContext, useState } from 'react';

interface AppContextType {
  searchQuery: string;
  initial: boolean;
  updateSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};

function AppContextProvider(props: PropsWithChildren) {
  const params = new URLSearchParams(window.location.search);
  const [searchQuery, updateSearchQueryState] = useState<string>(params.get('query') || '');
  const [initial, setInitial] = useState<boolean>(true);

  const providerValue = {
    searchQuery,
    updateSearchQuery: (query: string) => {
      setInitial(false)
      updateSearchQueryState(query);
    },
    initial,
  };

  return (
    <AppContext.Provider value={providerValue}>
      {props.children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
