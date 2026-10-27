package com.mitocode.service.impl;

import com.mitocode.model.Cliente;
import com.mitocode.repository.IClienteRepo;
import com.mitocode.repository.IGenericRepo;
import com.mitocode.service.IClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ClienteServiceImpl extends CRUDImpl<Cliente, Integer> implements IClienteService {

    //@Autowired
    private final IClienteRepo repo;

    @Override
    protected IGenericRepo<Cliente, Integer> getRepo() {
        return repo;
    }

}
